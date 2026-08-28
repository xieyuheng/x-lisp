#include "index.h"

xvm_t *make_xvm(program_t *program) {
  xvm_t *self = new(xvm_t);
  self->program = program;
  self->result = x_void;
  self->frame_buffer = make_buffer();
  self->frame_offset = 0;
  self->frame_count = 0;
  self->break_depth = 0;
  self->root_stack = make_stack();
  return self;
}

void xvm_free(xvm_t *self) {
  buffer_free(self->frame_buffer);
  stack_free(self->root_stack);
  free(self);
}

program_t *xvm_program(const xvm_t *self) {
  return self->program;
}

value_t xvm_result(const xvm_t *self) {
  return self->result;
}

void xvm_push_root(xvm_t *xvm, value_t value) {
  stack_push(xvm->root_stack, (void *) value);
}

void xvm_drop_root(xvm_t *xvm) {
  stack_pop(xvm->root_stack);
}

size_t xvm_frame_count(const xvm_t *xvm) {
  return xvm->frame_count;
}

inline frame_t *xvm_current_frame(xvm_t *xvm) {
  if (xvm->frame_count == 0) return NULL;
  return (frame_t *)(buffer_raw_bytes(xvm->frame_buffer) + xvm->frame_offset);
}

static inline void init_frame_header(frame_t *frame, const function_t *fn, size_t prev_frame_offset) {
  frame->function = fn;
  frame->pc = buffer_raw_bytes(fn->buffer);
  frame->local_count = fn->local_count;
  frame->prev_frame_offset = prev_frame_offset;
}

void xvm_push_function_frame(xvm_t *xvm, const function_t *fn,
                             uint8_t argc, const uint16_t *args) {
  frame_t *caller = xvm_current_frame(xvm);

  size_t new_offset = 0;
  if (caller) {
    new_offset = xvm->frame_offset + frame_byte_size(caller->local_count);
  }

  size_t new_size = frame_byte_size(fn->local_count);
  buffer_ensure_capacity(xvm->frame_buffer, new_offset + new_size);

  uint8_t *raw = buffer_raw_bytes(xvm->frame_buffer);
  frame_t *frame = (frame_t *)(raw + new_offset);
  init_frame_header(frame, fn, xvm->frame_offset);

  value_t *locals = frame_locals(frame);
  if (args && caller) {
    frame_t *caller_fresh = (frame_t *)(raw + xvm->frame_offset);
    value_t *caller_locals = frame_locals(caller_fresh);
    for (size_t i = 0; i < argc; i++) {
      locals[i] = caller_locals[args[i]];
    }
  }

  // Clear trailing locals to prevent GC from scanning stale object
  // pointers left in buffer memory by previously-popped frames.
  memory_clear(locals + argc, (fn->local_count - argc) * sizeof(value_t));

  buffer_seek(xvm->frame_buffer, new_offset + new_size);
  xvm->frame_offset = new_offset;
  xvm->frame_count++;
}

void xvm_push_function_frame_with_values(xvm_t *xvm, const function_t *fn,
                                          size_t argc, value_t *values) {
  frame_t *caller = xvm_current_frame(xvm);

  size_t new_offset = 0;
  if (caller) {
    new_offset = xvm->frame_offset + frame_byte_size(caller->local_count);
  }

  size_t new_size = frame_byte_size(fn->local_count);
  buffer_ensure_capacity(xvm->frame_buffer, new_offset + new_size);

  uint8_t *raw = buffer_raw_bytes(xvm->frame_buffer);
  frame_t *frame = (frame_t *)(raw + new_offset);
  init_frame_header(frame, fn, xvm->frame_offset);

  value_t *locals = frame_locals(frame);
  for (size_t i = 0; i < argc && i < fn->local_count; i++) {
    locals[i] = values[i];
  }

  // Clear trailing locals to prevent GC from scanning stale object
  // pointers left in buffer memory by previously-popped frames.
  memory_clear(locals + argc, (fn->local_count - argc) * sizeof(value_t));

  buffer_seek(xvm->frame_buffer, new_offset + new_size);
  xvm->frame_offset = new_offset;
  xvm->frame_count++;
}

void xvm_pop_frame(xvm_t *xvm) {
  frame_t *current = xvm_current_frame(xvm);
  xvm->frame_offset = current->prev_frame_offset;
  xvm->frame_count--;
  size_t current_start = (uint8_t *)current - buffer_raw_bytes(xvm->frame_buffer);
  buffer_seek(xvm->frame_buffer, current_start);
  xvm_gc_maybe_collect(xvm);
}

static void xvm_tail_call_replace(xvm_t *xvm, const function_t *fn,
                                   uint8_t argc, const uint16_t *args) {
  frame_t *current = xvm_current_frame(xvm);
  size_t prev_frame_offset = current->prev_frame_offset;
  size_t old_local_count = current->local_count;
  size_t current_start = (uint8_t *)current - buffer_raw_bytes(xvm->frame_buffer);

  // VLA[0] is UB in C, so ensure at least 1 element
  value_t saved[argc > 0 ? argc : 1];
  if (args) {
    value_t *current_locals = frame_locals(current);
    for (size_t i = 0; i < argc; i++) {
      saved[i] = current_locals[args[i]];
    }
  }

  size_t old_size = frame_byte_size(old_local_count);
  size_t new_size = frame_byte_size(fn->local_count);
  size_t new_end = current_start + new_size;

  if (new_size > old_size) {
    buffer_ensure_capacity(xvm->frame_buffer, new_end);
  }

  uint8_t *raw = buffer_raw_bytes(xvm->frame_buffer);
  frame_t *frame = (frame_t *)(raw + current_start);
  init_frame_header(frame, fn, prev_frame_offset);

  value_t *locals = frame_locals(frame);
  if (args) {
    for (size_t i = 0; i < argc; i++) {
      locals[i] = saved[i];
    }
  }

  // Clear trailing locals to prevent GC from scanning stale object
  // pointers left in buffer memory by previously-popped frames.
  memory_clear(locals + argc, (fn->local_count - argc) * sizeof(value_t));

  buffer_seek(xvm->frame_buffer, new_end);
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
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src);
  locals[dest] = locals[src];
  frame->pc += 1 + sizeof(uint16_t) + sizeof(uint16_t);
}

static inline void exec_load(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  value_t value; memory_load(frame->pc + 1 + sizeof(uint16_t), value);
  locals[dest] = value;
  frame->pc += 1 + sizeof(uint16_t) + sizeof(value_t);
}

static inline void exec_load_result(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  locals[dest] = xvm->result;
  frame->pc += 1 + sizeof(uint16_t);
}

static inline void exec_return(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t src; memory_load(frame->pc + 1, src);
  xvm->result = locals[src];
  xvm_push_root(xvm, xvm->result);
  xvm_pop_frame(xvm);
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
    xvm_push_function_frame(xvm, definition_function(def), argc, args);
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
    xvm_pop_frame(xvm);
    xvm_drop_root(xvm);
  } else {
    xvm_tail_call_replace(xvm, definition_function(def), argc, args);
  }
}

static inline void exec_ref(frame_t *frame, value_t *locals) {
  uint16_t dest;
  definition_t *def;
  decode_reg_def(frame->pc, &dest, &def);
  locals[dest] = x_object(def);
  frame->pc += 1 + sizeof(uint16_t) + sizeof(definition_t *);
}

static inline void exec_global_load(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t dest;
  definition_t *def;
  decode_reg_def(frame->pc, &dest, &def);
  if (def->kind != VARIABLE_DEFINITION) {
    who_printf("OP_GLOBAL_LOAD expect VARIABLE_DEFINITION\n");
    who_printf("  definition->name: %s\n", def->name);
    xvm_inspect(xvm);
    exit(1);
  }
  locals[dest] = def->variable_definition.value;
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

  xvm_pop_frame(xvm);

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

static inline void exec_iadd(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1);
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2);
  locals[dest] = x_iadd(locals[src1], locals[src2]);
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_isub(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1);
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2);
  locals[dest] = x_isub(locals[src1], locals[src2]);
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_imul(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1);
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2);
  locals[dest] = x_imul(locals[src1], locals[src2]);
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_idiv(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1);
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2);
  locals[dest] = x_idiv(locals[src1], locals[src2]);
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_imod(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1);
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2);
  locals[dest] = x_imod(locals[src1], locals[src2]);
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_int_greater(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1);
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2);
  locals[dest] = x_int_greater(locals[src1], locals[src2]);
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_int_less(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1);
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2);
  locals[dest] = x_int_less(locals[src1], locals[src2]);
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_int_greater_or_equal(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1);
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2);
  locals[dest] = x_int_greater_or_equal(locals[src1], locals[src2]);
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_int_less_or_equal(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1);
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2);
  locals[dest] = x_int_less_or_equal(locals[src1], locals[src2]);
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_ineg(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src);
  locals[dest] = x_ineg(locals[src]);
  frame->pc += 1 + 2 * sizeof(uint16_t);
}

static inline void exec_int_positive(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src);
  locals[dest] = x_int_positive(locals[src]);
  frame->pc += 1 + 2 * sizeof(uint16_t);
}

static inline void exec_int_non_negative(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src);
  locals[dest] = x_int_non_negative(locals[src]);
  frame->pc += 1 + 2 * sizeof(uint16_t);
}

static inline void exec_int_non_zero(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src);
  locals[dest] = x_int_non_zero(locals[src]);
  frame->pc += 1 + 2 * sizeof(uint16_t);
}

void xvm_execute(xvm_t *xvm) {
  assert(xvm->break_depth <= xvm->frame_count);

  while (xvm->frame_count > xvm->break_depth) {
    frame_t *frame = xvm_current_frame(xvm);
    value_t *locals = frame_locals(frame);

    switch (*frame->pc) {
    case OP_MOVE:          exec_move(frame, locals);                 break;
    case OP_LOAD:          exec_load(frame, locals);                 break;
    case OP_LOAD_RESULT:   exec_load_result(xvm, frame, locals);     break;
    case OP_RETURN:        exec_return(xvm, frame, locals);          continue;
    case OP_CALL:          exec_call(xvm, frame, locals);            break;
    case OP_TAIL_CALL:     exec_tail_call(xvm, frame, locals);       continue;
    case OP_REF:           exec_ref(frame, locals);                  break;
    case OP_GLOBAL_LOAD:   exec_global_load(xvm, frame, locals);     break;
    case OP_GLOBAL_STORE:  exec_global_store(xvm, frame, locals);    break;
    case OP_APPLY:         exec_apply(xvm, frame, locals);           break;
    case OP_TAIL_APPLY:    exec_tail_apply(xvm, frame, locals);      continue;
    case OP_JUMP:          exec_jump(frame);                         break;
    case OP_JUMP_IF_NOT:   exec_jump_if_not(frame, locals);          break;
    case OP_IADD:          exec_iadd(frame, locals);                    break;
    case OP_ISUB:          exec_isub(frame, locals);                    break;
    case OP_IMUL:          exec_imul(frame, locals);                    break;
    case OP_IDIV:          exec_idiv(frame, locals);                    break;
    case OP_IMOD:          exec_imod(frame, locals);                    break;
    case OP_INEG:          exec_ineg(frame, locals);                    break;
    case OP_INT_GREATER:   exec_int_greater(frame, locals);             break;
    case OP_INT_LESS:      exec_int_less(frame, locals);                break;
    case OP_INT_GREATER_OR_EQUAL: exec_int_greater_or_equal(frame, locals); break;
    case OP_INT_LESS_OR_EQUAL:    exec_int_less_or_equal(frame, locals);    break;
    case OP_INT_POSITIVE:  exec_int_positive(frame, locals);            break;
    case OP_INT_NON_NEGATIVE: exec_int_non_negative(frame, locals);     break;
    case OP_INT_NON_ZERO:  exec_int_non_zero(frame, locals);            break;
    }
  }
}

static void xvm_gc_roots_in_frame_buffer(xvm_t *xvm, array_t *roots) {
  frame_iter_t iter;
  frame_iter_init(&iter, xvm);
  frame_t *frame = frame_iter_next(&iter);
  while (frame) {
    value_t *locals = frame_locals(frame);
    for (size_t j = 0; j < frame->local_count; j++) {
      if (is_object(locals[j])) {
        array_push(roots, to_object(locals[j]));
      }
    }
    frame = frame_iter_next(&iter);
  }
}

static void xvm_gc_roots_in_mod(xvm_t *xvm, array_t *roots) {
  record_iter_t iter;
  record_iter_init(&iter, xvm_program(xvm)->definitions);
  definition_t *definition = record_iter_next_value(&iter);
  while (definition) {
    if (definition->kind == VARIABLE_DEFINITION) {
      value_t value = definition->variable_definition.value;
      if (is_object(value)) {
        array_push(roots, to_object(value));
      }
    }
    definition = record_iter_next_value(&iter);
  }
}

static array_t *xvm_gc_roots(xvm_t *xvm) {
  array_t *roots = make_array();
  xvm_gc_roots_in_frame_buffer(xvm, roots);
  xvm_gc_roots_in_mod(xvm, roots);

  for (size_t i = 0; i < stack_length(xvm->root_stack); i++) {
    value_t value = (value_t) stack_get(xvm->root_stack, i);
    if (is_object(value)) {
      array_push(roots, to_object(value));
    }
  }

  if (is_object(xvm->result)) {
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

  frame_iter_t iter;
  frame_iter_init(&iter, xvm);
  frame_t *frame = frame_iter_next(&iter);
  while (frame) {
    value_t *locals = frame_locals(frame);
    print_string("[");
    for (size_t j = 0; j < frame->local_count; j++) {
      print_value(locals[j]);
      print_string(" ");
    }
    print_string("] ");
    frame = frame_iter_next(&iter);
  }

  print_string("\n");
}
