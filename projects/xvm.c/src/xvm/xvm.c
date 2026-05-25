#include "index.h"

xvm_t *make_xvm(mod_t *mod) {
  xvm_t *self = new(xvm_t);
  self->mod = mod;
  self->result = x_void;
  self->frame_stack = make_stack_with((free_fn_t *) frame_free);
  self->break_depth = 0;
  self->root_stack = make_stack();
  return self;
}

void xvm_free(xvm_t *self) {
  stack_free(self->frame_stack);
  stack_free(self->root_stack);
  free(self);
}

mod_t *xvm_mod(const xvm_t *self) {
  return self->mod;
}

value_t xvm_result(const xvm_t *self) {
  return self->result;
}

inline void xvm_push_root(xvm_t *xvm, value_t value) {
  stack_push(xvm->root_stack, (void *) value);
}

inline void xvm_drop_root(xvm_t *xvm) {
  stack_pop(xvm->root_stack);
}

inline frame_t *xvm_top_frame(const xvm_t *xvm) {
  return stack_top(xvm->frame_stack);
}

inline void xvm_drop_frame(xvm_t *xvm) {
  frame_t *frame = stack_pop(xvm->frame_stack);
  frame_free(frame);
  xvm_gc_maybe_collect(xvm);
}

inline void xvm_push_frame(xvm_t *xvm, frame_t *frame) {
  stack_push(xvm->frame_stack, frame);
}

inline size_t xvm_frame_count(const xvm_t *xvm) {
  return stack_length(xvm->frame_stack);
}


static void decode_call(uint8_t *pc, definition_t **def, uint8_t *argc, uint16_t **args) {
  memory_load(pc + 1, *def);
  *argc = pc[1 + sizeof(definition_t *)];
  *args = (uint16_t *)(pc + 1 + sizeof(definition_t *) + sizeof(uint8_t));
}

static void decode_apply(uint8_t *pc, uint16_t *target, uint8_t *argc, uint16_t **args) {
  memory_load(pc + 1, *target);
  *argc = pc[1 + sizeof(uint16_t)];
  *args = (uint16_t *)(pc + 1 + sizeof(uint16_t) + sizeof(uint8_t));
}

static void decode_reg_def(uint8_t *pc, uint16_t *reg, definition_t **def) {
  memory_load(pc + 1, *reg);
  memory_load(pc + 1 + sizeof(uint16_t), *def);
}

static inline void exec_move(frame_t *frame, value_t *locals) {
  uint16_t dst; memory_load(frame->pc + 1, dst);
  uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src);
  locals[dst] = locals[src];
  frame->pc += 1 + sizeof(uint16_t) + sizeof(uint16_t);
}

static inline void exec_load(frame_t *frame, value_t *locals) {
  uint16_t dst; memory_load(frame->pc + 1, dst);
  value_t value; memory_load(frame->pc + 1 + sizeof(uint16_t), value);
  locals[dst] = value;
  frame->pc += 1 + sizeof(uint16_t) + sizeof(value_t);
}

static inline void exec_load_result(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t dst; memory_load(frame->pc + 1, dst);
  locals[dst] = xvm->result;
  frame->pc += 1 + sizeof(uint16_t);
}

static inline void exec_return(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t src; memory_load(frame->pc + 1, src);
  xvm->result = locals[src];
  xvm_push_root(xvm, xvm->result);
  xvm_drop_frame(xvm);
  xvm_drop_root(xvm);
}

static inline void exec_call(xvm_t *xvm, frame_t *frame, value_t *locals) {
  definition_t *def;
  uint8_t argc;
  uint16_t *args;
  decode_call(frame->pc, &def, &argc, &args);
  frame->pc += 1 + sizeof(definition_t *) + sizeof(uint8_t) + argc * sizeof(uint16_t);

  if (def->kind == PRIMITIVE_DEFINITION) {
    call_primitive(xvm, locals, def->primitive_definition.primitive, argc, args);
  } else if (def->kind == FUNCTION_DEFINITION) {
    frame_t *callee = make_function_frame(
      definition_function(def), argc, args, locals);
    xvm_push_frame(xvm, callee);
  } else {
    unreachable();
  }
}

static inline void exec_tail_call(xvm_t *xvm, frame_t *frame, value_t *locals) {
  definition_t *def;
  uint8_t argc;
  uint16_t *args;
  decode_call(frame->pc, &def, &argc, &args);

  if (def->kind == PRIMITIVE_DEFINITION) {
    call_primitive(xvm, locals, def->primitive_definition.primitive, argc, args);
    xvm_push_root(xvm, xvm->result);
    xvm_drop_frame(xvm);
    xvm_drop_root(xvm);
  } else {
    const function_t *fn = definition_function(def);
    // VLA[0] is UB in C, so ensure at least 1 element
    value_t saved[fn->local_count > 0 ? fn->local_count : 1];
    for (size_t i = 0; i < argc; i++) {
      saved[i] = locals[args[i]];
    }

    free(frame->locals);

    frame->pc = buffer_raw_bytes(fn->buffer);
    frame->function = fn;
    frame->local_count = fn->local_count;
    frame->locals = allocate(sizeof(value_t) * fn->local_count);

    for (size_t i = 0; i < argc; i++) {
      frame->locals[i] = saved[i];
    }
  }
}

static inline void exec_ref(frame_t *frame, value_t *locals) {
  uint16_t dst;
  definition_t *def;
  decode_reg_def(frame->pc, &dst, &def);
  locals[dst] = x_object(def);
  frame->pc += 1 + sizeof(uint16_t) + sizeof(definition_t *);
}

static inline void exec_global_load(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t dst;
  definition_t *def;
  decode_reg_def(frame->pc, &dst, &def);
  if (def->kind != VARIABLE_DEFINITION) {
    who_printf("OP_GLOBAL_LOAD expect VARIABLE_DEFINITION\n");
    who_printf("  definition->name: %s\n", def->name);
    xvm_inspect(xvm);
    exit(1);
  }
  locals[dst] = def->variable_definition.value;
  frame->pc += 1 + sizeof(uint16_t) + sizeof(definition_t *);
}

static inline void exec_global_store(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t src;
  definition_t *def;
  decode_reg_def(frame->pc, &src, &def);
  if (def->kind != VARIABLE_DEFINITION) {
    who_printf("OP_GLOBAL_STORE expect VARIABLE_DEFINITION\n");
    who_printf("  definition->name: %s\n", def->name);
    xvm_inspect(xvm);
    exit(1);
  }
  def->variable_definition.value = locals[src];
  frame->pc += 1 + sizeof(uint16_t) + sizeof(definition_t *);
}

static inline void exec_apply(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  uint8_t argc;
  uint16_t *args;
  decode_apply(frame->pc, &target_reg, &argc, &args);
  frame->pc += 1 + sizeof(uint16_t) + sizeof(uint8_t) + argc * sizeof(uint16_t);
  apply(xvm, locals[target_reg], argc, args, locals);
}

static inline void exec_tail_apply(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  uint8_t argc;
  uint16_t *args;
  decode_apply(frame->pc, &target_reg, &argc, &args);

  value_t target = locals[target_reg];
  size_t count = (size_t)argc + 1;
  value_t tmp[count];
  tmp[0] = target;
  for (size_t i = 0; i < argc; i++) {
    tmp[i + 1] = locals[args[i]];
  }

  for (size_t i = 0; i < count; i++) {
    xvm_push_root(xvm, tmp[i]);
  }

  xvm_drop_frame(xvm);

  // VLA[0] is UB in C, so ensure at least 1 element
  uint16_t apply_args[argc > 0 ? argc : 1];
  for (size_t i = 0; i < argc; i++) {
    apply_args[i] = (uint16_t)(i + 1);
  }

  apply(xvm, target, argc, apply_args, tmp);

  for (size_t i = 0; i < count; i++) {
    xvm_drop_root(xvm);
  }
}

static inline void exec_jump(frame_t *frame) {
  int32_t offset; memory_load(frame->pc + 1, offset);
  frame->pc += 1 + sizeof(int32_t) + offset;
}

static inline void exec_jump_if_not(frame_t *frame, value_t *locals) {
  uint16_t src; memory_load(frame->pc + 1, src);
  int32_t offset; memory_load(frame->pc + 1 + sizeof(uint16_t), offset);
  frame->pc += 1 + sizeof(uint16_t) + sizeof(int32_t);
  if (locals[src] == x_false) {
    frame->pc += offset;
  }
}

void xvm_execute(xvm_t *xvm) {
  assert(xvm->break_depth <= xvm_frame_count(xvm));

  while (xvm_frame_count(xvm) > xvm->break_depth) {
    frame_t *frame = xvm_top_frame(xvm);
    value_t *locals = frame->locals;

    switch (*frame->pc) {
    case OP_MOVE:   exec_move(frame, locals);               break;
    case OP_LOAD:   exec_load(frame, locals);               break;
    case OP_LOAD_RESULT: exec_load_result(xvm, frame, locals);       break;
    case OP_RETURN: exec_return(xvm, frame, locals);        continue;
    case OP_CALL:   exec_call(xvm, frame, locals);          break;
    case OP_TAIL_CALL: exec_tail_call(xvm, frame, locals);  continue;
    case OP_REF:    exec_ref(frame, locals);                break;
    case OP_GLOBAL_LOAD: exec_global_load(xvm, frame, locals);   break;
    case OP_GLOBAL_STORE: exec_global_store(xvm, frame, locals); break;
    case OP_APPLY:  exec_apply(xvm, frame, locals);         break;
    case OP_TAIL_APPLY: exec_tail_apply(xvm, frame, locals); continue;
    case OP_JUMP:   exec_jump(frame);                       break;
    case OP_JUMP_IF_NOT: exec_jump_if_not(frame, locals);   break;
    }
  }
}

static void xvm_gc_roots_in_frame_stack(xvm_t *xvm, array_t *roots) {
  for (size_t i = 0; i < stack_length(xvm->frame_stack); i++) {
    frame_t *frame = stack_get(xvm->frame_stack, i);
    for (size_t j = 0; j < frame->local_count; j++) {
      if (object_p(frame->locals[j])) {
        array_push(roots, to_object(frame->locals[j]));
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
  xvm_gc_roots_in_frame_stack(xvm, roots);
  xvm_gc_roots_in_mod(xvm, roots);

  for (size_t i = 0; i < stack_length(xvm->root_stack); i++) {
    value_t value = (value_t) stack_get(xvm->root_stack, i);
    if (object_p(value)) {
      array_push(roots, to_object(value));
    }
  }

  if (object_p(xvm->result)) {
    array_push(roots, to_object(xvm->result));
  }

  return roots;
}

void xvm_gc_maybe_collect(xvm_t *xvm) {
  static size_t gc_threshold = 4096;

  size_t before = gc_object_count(global_gc);
  if (before < gc_threshold) return;

  array_t *roots = xvm_gc_roots(xvm);
  for (size_t i = 0; i < array_length(roots); i++) {
    gc_mark_object(global_gc, array_get(roots, i));
  }

  gc_mark(global_gc);
  gc_sweep(global_gc);
  array_free(roots);

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
  print_string("-- ");

  for (size_t i = 0; i < xvm_frame_count(xvm); i++) {
    frame_t *frame = stack_get(xvm->frame_stack, i);
    print_string("[");
    for (size_t j = 0; j < frame->local_count; j++) {
      print_value(frame->locals[j]);
      print_string(" ");
    }
    print_string("] ");
  }

  print_string("\n");
}
