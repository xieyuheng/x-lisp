#include "index.h"

struct vm_t {
  mod_t *mod;
  stack_t *value_stack;
  stack_t *frame_stack;
};

vm_t *make_vm(mod_t *mod) {
  vm_t *self = new(vm_t);
  self->mod = mod;
  self->value_stack = make_stack();
  self->frame_stack = make_stack_with((free_fn_t *) frame_free);
  return self;
}

void vm_free(vm_t *self) {
  stack_free(self->value_stack);
  stack_free(self->frame_stack);
  free(self);
}

mod_t *vm_mod(const vm_t *self) {
  return self->mod;
}

inline value_t vm_pop(vm_t *vm) {
  return (value_t) stack_pop(vm->value_stack);
}

inline void vm_push(vm_t *vm, value_t value) {
  stack_push(vm->value_stack, (void *) value);
}

inline void vm_swap_many(vm_t *vm, size_t m, size_t n) {
  // m n -- n m

  stack_t *n_stack = make_stack();
  for (size_t i = 0; i < n; i++) {
    stack_push(n_stack, (void *) vm_pop(vm));
  }

  stack_t *m_stack = make_stack();
  for (size_t i = 0; i < m; i++) {
    stack_push(m_stack, (void *) vm_pop(vm));
  }

  for (size_t i = 0; i < n; i++) {
    vm_push(vm, (value_t) stack_pop(n_stack));
  }

  for (size_t i = 0; i < m; i++) {
    vm_push(vm, (value_t) stack_pop(m_stack));
  }

  stack_free(n_stack);
  stack_free(m_stack);
  return;
}

inline frame_t *vm_top_frame(const vm_t *vm) {
  return stack_top(vm->frame_stack);
}

inline void vm_drop_frame(vm_t *vm) {
  stack_pop(vm->frame_stack);

  // - it is ok to try gc here,
  //   if we do not use loop syntax,
  //   and always use tail-call to implement loop.

  vm_gc_maybe_collect(vm);
}

inline void vm_push_frame(vm_t *vm, frame_t *frame) {
  stack_push(vm->frame_stack, frame);
}

inline size_t vm_frame_count(const vm_t *vm) {
  return stack_length(vm->frame_stack);
}

static inline void vm_execute_instr(vm_t *vm, frame_t *frame, struct instr_t instr) {
  switch (instr.op) {
  case OP_LITERAL: {
    vm_push(vm, instr.literal.value);
    return;
  }

  case OP_RETURN: {
    stack_pop(vm->frame_stack);
    frame_free(frame);
    return;
  }

  case OP_CALL: {
    call_definition(vm, instr.ref.definition);
    return;
  }

  case OP_TAIL_CALL: {
    stack_pop(vm->frame_stack);
    frame_free(frame);
    call_definition(vm, instr.ref.definition);
    return;
  }

  case OP_REF: {
    vm_push(vm, x_object(instr.ref.definition));
    return;
  }

  case OP_GLOBAL_LOAD: {
    definition_t *definition = instr.ref.definition;
    if (definition->kind != VARIABLE_DEFINITION) {
      who_printf("OP_GLOBAL_LOAD expect VARIABLE_DEFINITION\n");
      who_printf("  definition->name: %s\n", definition->name);
      vm_inspect(vm);
      exit(1);
    }

    vm_push(vm, definition->variable_definition.value);
    return;
  }

  case OP_GLOBAL_STORE: {
    value_t value = vm_pop(vm);
    definition_t *definition = instr.ref.definition;
    if (definition->kind != VARIABLE_DEFINITION) {
      who_printf("OP_GLOBAL_LOAD expect VARIABLE_DEFINITION\n");
      who_printf("  definition->name: %s\n", definition->name);
      vm_inspect(vm);
      exit(1);
    }

    definition->variable_definition.value = value;
    return;
  }

  case OP_APPLY: {
    value_t target = vm_pop(vm);
    apply(vm, instr.apply.argc, target);
    return;
  }

  case OP_TAIL_APPLY: {
    value_t target = vm_pop(vm);
    stack_pop(vm->frame_stack);
    frame_free(frame);
    apply(vm, instr.apply.argc, target);
    return;
  }

  case OP_LOCAL_LOAD: {
    value_t value = frame_get_local(frame, instr.local.index);
    vm_push(vm, value);
    return;
  }

  case OP_LOCAL_STORE: {
    value_t value = vm_pop(vm);
    frame_put_local(frame, instr.local.index, value);
    return;
  }

  case OP_JUMP: {
    frame->pc += instr.jump.offset;
    return;
  }

  case OP_JUMP_IF_NOT: {
    value_t value = vm_pop(vm);
    if (value == x_false) {
      frame->pc += instr.jump.offset;
    }
    return;
  }

  case OP_DROP: {
    vm_pop(vm);
    return;
  }
  }
}

void vm_execute(vm_t *vm) {
  while (vm_frame_count(vm) > 0) {
    frame_t *frame = stack_top(vm->frame_stack);
    if (frame->kind == BREAK_FRAME) {
      stack_pop(vm->frame_stack);
      return;
    }

    struct instr_t instr = instr_decode(frame->pc);
    frame->pc += instr_length(instr);
    vm_execute_instr(vm, frame, instr);

    // debug

    {
      // vm_inspect(vm);
    }
  }
}

static void vm_gc_roots_in_value_stack(vm_t *vm, array_t *roots) {
  for (size_t i = 0; i < stack_length(vm->value_stack); i++) {
    value_t value = (value_t) stack_get(vm->value_stack, i);
    if (object_p(value)) {
      array_push(roots, to_object(value));
    }
  }
}

static void vm_gc_roots_in_frame_stack(vm_t *vm, array_t *roots) {
  for (size_t i = 0; i < stack_length(vm->frame_stack); i++) {
    frame_t *frame = stack_get(vm->frame_stack, i);
    for (size_t i = 0; i < array_length(frame->locals); i++) {
      value_t value = frame_get_local(frame, i);
      if (object_p(value)) {
        array_push(roots, to_object(value));
      }
    }
  }
}

static void vm_gc_roots_in_mod(vm_t *vm, array_t *roots) {
  record_iter_t iter;
  record_iter_init(&iter, vm_mod(vm)->definitions);
  definition_t *definition = record_iter_next_value(&iter);
  while (definition) {
    if (definition->kind == VARIABLE_DEFINITION) {
      value_t value = definition->variable_definition.value;
      if (object_p(value)) {
        array_push(roots, to_object(value));
      }
    }

    definition = record_iter_next_value(&iter);
  }
}

static array_t *vm_gc_roots(vm_t *vm) {
  array_t *roots = make_array();
  vm_gc_roots_in_value_stack(vm, roots);
  vm_gc_roots_in_frame_stack(vm, roots);
  vm_gc_roots_in_mod(vm, roots);
  return roots;
}

void vm_gc_maybe_collect(vm_t *vm) {
#if GC_DEBUG
  who_printf("before\n");
  gc_report(global_gc);
#endif

  if (gc_object_count(global_gc) < GC_OBJECT_THRESHOLD) {
    return;
  }

  array_t *roots = vm_gc_roots(vm);
  for (size_t i = 0; i < array_length(roots); i++) {
    gc_mark_object(global_gc, array_get(roots, i));
  }

  gc_mark(global_gc);
  gc_sweep(global_gc);
  array_free(roots);

#if GC_DEBUG
  who_printf("after\n");
  gc_report(global_gc);
#endif
}

void vm_inspect(vm_t *vm) {
  // print value stack

  print_string("-- ");

  for (size_t i = 0; i < stack_length(vm->value_stack); i++) {
    value_t value = (value_t) stack_get(vm->value_stack, i);
    print_value(value);
    print_string(" ");
  }

  print_string("\n");
}
