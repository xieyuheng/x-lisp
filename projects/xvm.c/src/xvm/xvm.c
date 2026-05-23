#include "index.h"

struct xvm_t {
  mod_t *mod;
  stack_t *value_stack;
  stack_t *frame_stack;
  stack_t *root_stack;
};

xvm_t *make_xvm(mod_t *mod) {
  xvm_t *self = new(xvm_t);
  self->mod = mod;
  self->value_stack = make_stack();
  self->frame_stack = make_stack_with((free_fn_t *) frame_free);
  self->root_stack = make_stack();
  return self;
}

void xvm_free(xvm_t *self) {
  stack_free(self->value_stack);
  stack_free(self->frame_stack);
  stack_free(self->root_stack);
  free(self);
}

mod_t *xvm_mod(const xvm_t *self) {
  return self->mod;
}

inline value_t xvm_pop(xvm_t *xvm) {
  return (value_t) stack_pop(xvm->value_stack);
}

inline void xvm_push(xvm_t *xvm, value_t value) {
  stack_push(xvm->value_stack, (void *) value);
}

inline void xvm_push_root(xvm_t *xvm, value_t value) {
  stack_push(xvm->root_stack, (void *) value);
}

inline void xvm_drop_root(xvm_t *xvm) {
  stack_pop(xvm->root_stack);
}

inline void xvm_swap_many(xvm_t *xvm, size_t m, size_t n) {
  // m n -- n m

  stack_t *n_stack = make_stack();
  for (size_t i = 0; i < n; i++) {
    stack_push(n_stack, (void *) xvm_pop(xvm));
  }

  stack_t *m_stack = make_stack();
  for (size_t i = 0; i < m; i++) {
    stack_push(m_stack, (void *) xvm_pop(xvm));
  }

  for (size_t i = 0; i < n; i++) {
    xvm_push(xvm, (value_t) stack_pop(n_stack));
  }

  for (size_t i = 0; i < m; i++) {
    xvm_push(xvm, (value_t) stack_pop(m_stack));
  }

  stack_free(n_stack);
  stack_free(m_stack);
  return;
}

inline frame_t *xvm_top_frame(const xvm_t *xvm) {
  return stack_top(xvm->frame_stack);
}

inline void xvm_drop_frame(xvm_t *xvm) {
  frame_t *frame = stack_pop(xvm->frame_stack);
  frame_free(frame);

  // - it is ok to try gc here,
  //   if we do not use loop syntax,
  //   and always use tail-call to implement loop.

  xvm_gc_maybe_collect(xvm);
}

inline void xvm_push_frame(xvm_t *xvm, frame_t *frame) {
  stack_push(xvm->frame_stack, frame);
}

inline size_t xvm_frame_count(const xvm_t *xvm) {
  return stack_length(xvm->frame_stack);
}

static inline void xvm_execute_instr(xvm_t *xvm, frame_t *frame, struct instr_t instr) {
  switch (instr.op) {
  case OP_LITERAL: {
    xvm_push(xvm, instr.literal.value);
    return;
  }

  case OP_RETURN: {
    xvm_drop_frame(xvm);
    return;
  }

  case OP_CALL: {
    call_definition(xvm, instr.ref.definition);
    return;
  }

  case OP_TAIL_CALL: {
    xvm_drop_frame(xvm);
    call_definition(xvm, instr.ref.definition);
    return;
  }

  case OP_REF: {
    xvm_push(xvm, x_object(instr.ref.definition));
    return;
  }

  case OP_GLOBAL_LOAD: {
    definition_t *definition = instr.ref.definition;
    if (definition->kind != VARIABLE_DEFINITION) {
      who_printf("OP_GLOBAL_LOAD expect VARIABLE_DEFINITION\n");
      who_printf("  definition->name: %s\n", definition->name);
      xvm_inspect(xvm);
      exit(1);
    }

    xvm_push(xvm, definition->variable_definition.value);
    return;
  }

  case OP_GLOBAL_STORE: {
    value_t value = xvm_pop(xvm);
    definition_t *definition = instr.ref.definition;
    if (definition->kind != VARIABLE_DEFINITION) {
      who_printf("OP_GLOBAL_LOAD expect VARIABLE_DEFINITION\n");
      who_printf("  definition->name: %s\n", definition->name);
      xvm_inspect(xvm);
      exit(1);
    }

    definition->variable_definition.value = value;
    return;
  }

  case OP_APPLY: {
    value_t target = xvm_pop(xvm);
    apply(xvm, instr.apply.argc, target);
    return;
  }

  case OP_TAIL_APPLY: {
    value_t target = xvm_pop(xvm);
    xvm_push_root(xvm, target);
    xvm_drop_frame(xvm);
    xvm_drop_root(xvm);
    apply(xvm, instr.apply.argc, target);
    return;
  }

  case OP_LOCAL_LOAD: {
    value_t value = frame_get_local(frame, instr.local.index);
    xvm_push(xvm, value);
    return;
  }

  case OP_LOCAL_STORE: {
    value_t value = xvm_pop(xvm);
    frame_put_local(frame, instr.local.index, value);
    return;
  }

  case OP_JUMP: {
    frame->pc += instr.jump.offset;
    return;
  }

  case OP_JUMP_IF_NOT: {
    value_t value = xvm_pop(xvm);
    if (value == x_false) {
      frame->pc += instr.jump.offset;
    }
    return;
  }

  case OP_DROP: {
    xvm_pop(xvm);
    return;
  }
  }
}

void xvm_execute(xvm_t *xvm) {
  while (xvm_frame_count(xvm) > 0) {
    frame_t *frame = stack_top(xvm->frame_stack);
    if (frame->kind == BREAK_FRAME) {
      xvm_drop_frame(xvm);
      return;
    }

    struct instr_t instr = instr_decode(frame->pc);
    frame->pc += instr_length(instr);
    xvm_execute_instr(xvm, frame, instr);

    // debug

    {
      // xvm_inspect(xvm);
    }
  }
}

static void xvm_gc_roots_in_value_stack(xvm_t *xvm, array_t *roots) {
  for (size_t i = 0; i < stack_length(xvm->value_stack); i++) {
    value_t value = (value_t) stack_get(xvm->value_stack, i);
    if (object_p(value)) {
      array_push(roots, to_object(value));
    }
  }
}

static void xvm_gc_roots_in_frame_stack(xvm_t *xvm, array_t *roots) {
  for (size_t i = 0; i < stack_length(xvm->frame_stack); i++) {
    frame_t *frame = stack_get(xvm->frame_stack, i);
    for (size_t i = 0; i < array_length(frame->locals); i++) {
      (void) roots;
      value_t value = frame_get_local(frame, i);
      if (object_p(value)) {
        array_push(roots, to_object(value));
      }
    }
  }
}

static void xvm_gc_roots_in_mod(xvm_t *xvm, array_t *roots) {
  record_iter_t iter;
  record_iter_init(&iter, xvm_mod(xvm)->definitions);
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

static array_t *xvm_gc_roots(xvm_t *xvm) {
  array_t *roots = make_array();
  xvm_gc_roots_in_value_stack(xvm, roots);
  xvm_gc_roots_in_frame_stack(xvm, roots);
  xvm_gc_roots_in_mod(xvm, roots);

  for (size_t i = 0; i < stack_length(xvm->root_stack); i++) {
    value_t value = (value_t) stack_get(xvm->root_stack, i);
    if (object_p(value)) {
      array_push(roots, to_object(value));
    }
  }

  return roots;
}

void xvm_gc_maybe_collect(xvm_t *xvm) {
  static size_t gc_threshold = 4096;

  size_t before = gc_object_count(global_gc);
  if (before < gc_threshold) return;

#if GC_DEBUG
  who_printf("before\n");
  gc_report(global_gc);
#endif

  array_t *roots = xvm_gc_roots(xvm);
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

  size_t after = gc_object_count(global_gc);
  size_t freed = before - after;

  if (freed < before / 10) {
    gc_threshold = before * 2;
  } else {
    gc_threshold = after * 2;
  }
  if (gc_threshold < 1024) {
    gc_threshold = 1024;
  }
}

void xvm_inspect(xvm_t *xvm) {
  // print value stack

  print_string("-- ");

  for (size_t i = 0; i < stack_length(xvm->value_stack); i++) {
    value_t value = (value_t) stack_get(xvm->value_stack, i);
    print_value(value);
    print_string(" ");
  }

  print_string("\n");
}
