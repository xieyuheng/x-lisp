#include "index.h"

xvm_t *make_xvm(mod_t *mod) {
  xvm_t *self = new(xvm_t);
  self->mod = mod;
  self->result = x_void;
  self->frame_buffer = make_buffer();
  self->frame_sp = 0;
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

inline size_t xvm_frame_count(const xvm_t *xvm) {
  return xvm->frame_count;
}


void xvm_push_function_frame(xvm_t *xvm, const function_t *fn,
                             uint8_t argc, const uint16_t *args) {
  frame_t *caller = xvm_current_frame(xvm);

  size_t new_sp = 0;
  if (caller) {
    new_sp = xvm->frame_sp + frame_byte_size(caller->local_count);
  }

  size_t new_size = frame_byte_size(fn->local_count);
  buffer_ensure_capacity(xvm->frame_buffer, new_sp + new_size);

  uint8_t *raw = buffer_raw_bytes(xvm->frame_buffer);
  frame_t *frame = (frame_t *)(raw + new_sp);
  frame->function = fn;
  frame->pc = buffer_raw_bytes(fn->buffer);
  frame->local_count = fn->local_count;
  frame->prev_sp = xvm->frame_sp;

  value_t *locals = frame_locals(frame);
  if (args && caller) {
    frame_t *caller_fresh = (frame_t *)(raw + xvm->frame_sp);
    value_t *caller_locals = frame_locals(caller_fresh);
    for (size_t i = 0; i < argc; i++) {
      locals[i] = caller_locals[args[i]];
    }
  }

  buffer_seek(xvm->frame_buffer, new_sp + new_size);
  xvm->frame_sp = new_sp;
  xvm->frame_count++;
}

void xvm_push_function_frame_with_values(xvm_t *xvm, const function_t *fn,
                                          size_t argc, value_t *values) {
  frame_t *caller = xvm_current_frame(xvm);

  size_t new_sp = 0;
  if (caller) {
    new_sp = xvm->frame_sp + frame_byte_size(caller->local_count);
  }

  size_t new_size = frame_byte_size(fn->local_count);
  buffer_ensure_capacity(xvm->frame_buffer, new_sp + new_size);

  uint8_t *raw = buffer_raw_bytes(xvm->frame_buffer);
  frame_t *frame = (frame_t *)(raw + new_sp);
  frame->function = fn;
  frame->pc = buffer_raw_bytes(fn->buffer);
  frame->local_count = fn->local_count;
  frame->prev_sp = xvm->frame_sp;

  value_t *locals = frame_locals(frame);
  for (size_t i = 0; i < argc && i < fn->local_count; i++) {
    locals[i] = values[i];
  }

  buffer_seek(xvm->frame_buffer, new_sp + new_size);
  xvm->frame_sp = new_sp;
  xvm->frame_count++;
}

void xvm_pop_frame(xvm_t *xvm) {
  frame_t *current = xvm_current_frame(xvm);
  xvm->frame_sp = current->prev_sp;
  xvm->frame_count--;
  // Truncate buffer to the start of the popped frame
  size_t current_start = (uint8_t *)current - buffer_raw_bytes(xvm->frame_buffer);
  buffer_seek(xvm->frame_buffer, current_start);
  xvm_gc_maybe_collect(xvm);
}

static void xvm_tail_call_replace(xvm_t *xvm, const function_t *fn,
                                   uint8_t argc, const uint16_t *args) {
  frame_t *current = xvm_current_frame(xvm);
  size_t prev_sp = current->prev_sp;
  size_t old_local_count = current->local_count;
  size_t current_start = (uint8_t *)current - buffer_raw_bytes(xvm->frame_buffer);

  value_t saved[fn->local_count > 0 ? fn->local_count : 1];
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
  frame->function = fn;
  frame->pc = buffer_raw_bytes(fn->buffer);
  frame->local_count = fn->local_count;
  frame->prev_sp = prev_sp;

  value_t *locals = frame_locals(frame);
  if (args) {
    for (size_t i = 0; i < argc; i++) {
      locals[i] = saved[i];
    }
  }

  buffer_seek(xvm->frame_buffer, new_end);
}

void call_primitive(xvm_t *xvm, value_t *locals,
                    const primitive_t *primitive, uint8_t argc, const uint16_t *args) {
  (void) argc;
  switch (primitive->fn_kind) {
  case X_FN_0: { xvm->result = primitive->fn_0(); return; }
  case X_FN_1: { xvm->result = primitive->fn_1(locals[args[0]]); return; }
  case X_FN_2: {
    xvm->result = primitive->fn_2(locals[args[0]], locals[args[1]]); return;
  }
  case X_FN_3: {
    xvm->result = primitive->fn_3(locals[args[0]], locals[args[1]], locals[args[2]]);
    return;
  }
  case X_FN_4: {
    xvm->result = primitive->fn_4(locals[args[0]], locals[args[1]],
                                   locals[args[2]], locals[args[3]]);
    return;
  }
  case X_FN_5: {
    xvm->result = primitive->fn_5(locals[args[0]], locals[args[1]],
                                   locals[args[2]], locals[args[3]],
                                   locals[args[4]]);
    return;
  }
  case X_FN_6: {
    xvm->result = primitive->fn_6(locals[args[0]], locals[args[1]],
                                   locals[args[2]], locals[args[3]],
                                   locals[args[4]], locals[args[5]]);
    return;
  }
  }
}

void xvm_execute(xvm_t *xvm) {
  assert(xvm->break_depth <= xvm->frame_count);

  while (xvm->frame_count > xvm->break_depth) {
    frame_t *frame = xvm_current_frame(xvm);
    value_t *locals = frame_locals(frame);

    switch (*frame->pc) {
    case OP_MOVE: {
      uint16_t dst; memory_load(frame->pc + 1, dst);
      uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src);
      locals[dst] = locals[src];
      frame->pc += 1 + sizeof(uint16_t) + sizeof(uint16_t);
      break;
    }

    case OP_LOAD: {
      uint16_t dst; memory_load(frame->pc + 1, dst);
      value_t value; memory_load(frame->pc + 1 + sizeof(uint16_t), value);
      locals[dst] = value;
      frame->pc += 1 + sizeof(uint16_t) + sizeof(value_t);
      break;
    }

    case OP_LOAD_RESULT: {
      uint16_t dst; memory_load(frame->pc + 1, dst);
      locals[dst] = xvm->result;
      frame->pc += 1 + sizeof(uint16_t);
      break;
    }

    case OP_RETURN: {
      uint16_t src; memory_load(frame->pc + 1, src);
      xvm->result = locals[src];
      xvm_push_root(xvm, xvm->result);
      xvm_pop_frame(xvm);
      xvm_drop_root(xvm);
      continue;
    }

    case OP_CALL: {
      definition_t *def; memory_load(frame->pc + 1, def);
      uint8_t argc = frame->pc[1 + sizeof(definition_t *)];
      uint16_t *args =
        (uint16_t *) (frame->pc + 1 + sizeof(definition_t *) + sizeof(uint8_t));

      frame->pc += 1 + sizeof(definition_t *) + sizeof(uint8_t) + argc * sizeof(uint16_t);

      if (def->kind == PRIMITIVE_DEFINITION) {
        call_primitive(xvm, locals, def->primitive_definition.primitive, argc, args);
      } else if (def->kind == FUNCTION_DEFINITION) {
        xvm_push_function_frame(xvm, definition_function(def), argc, args);
      } else {
        unreachable();
      }
      break;
    }

    case OP_TAIL_CALL: {
      definition_t *def; memory_load(frame->pc + 1, def);
      uint8_t argc = frame->pc[1 + sizeof(definition_t *)];
      uint16_t *args =
        (uint16_t *) (frame->pc + 1 + sizeof(definition_t *) + sizeof(uint8_t));

      if (def->kind == PRIMITIVE_DEFINITION) {
        call_primitive(xvm, locals, def->primitive_definition.primitive, argc, args);
        xvm_push_root(xvm, xvm->result);
        xvm_pop_frame(xvm);
        xvm_drop_root(xvm);
      } else {
        xvm_tail_call_replace(xvm, definition_function(def), argc, args);
      }
      continue;
    }

    case OP_REF: {
      uint16_t dst; memory_load(frame->pc + 1, dst);
      definition_t *def;
      memory_load(frame->pc + 1 + sizeof(uint16_t), def);
      locals[dst] = x_object(def);
      frame->pc += 1 + sizeof(uint16_t) + sizeof(definition_t *);
      break;
    }

    case OP_GLOBAL_LOAD: {
      uint16_t dst; memory_load(frame->pc + 1, dst);
      definition_t *def;
      memory_load(frame->pc + 1 + sizeof(uint16_t), def);
      if (def->kind != VARIABLE_DEFINITION) {
        who_printf("OP_GLOBAL_LOAD expect VARIABLE_DEFINITION\n");
        who_printf("  definition->name: %s\n", def->name);
        xvm_inspect(xvm);
        exit(1);
      }
      locals[dst] = def->variable_definition.value;
      frame->pc += 1 + sizeof(uint16_t) + sizeof(definition_t *);
      break;
    }

    case OP_GLOBAL_STORE: {
      uint16_t src; memory_load(frame->pc + 1, src);
      definition_t *def;
      memory_load(frame->pc + 1 + sizeof(uint16_t), def);
      if (def->kind != VARIABLE_DEFINITION) {
        who_printf("OP_GLOBAL_STORE expect VARIABLE_DEFINITION\n");
        who_printf("  definition->name: %s\n", def->name);
        xvm_inspect(xvm);
        exit(1);
      }
      def->variable_definition.value = locals[src];
      frame->pc += 1 + sizeof(uint16_t) + sizeof(definition_t *);
      break;
    }

    case OP_APPLY: {
      uint16_t target_reg; memory_load(frame->pc + 1, target_reg);
      uint8_t argc = frame->pc[1 + sizeof(uint16_t)];
      uint16_t *args =
        (uint16_t *) (frame->pc + 1 + sizeof(uint16_t) + sizeof(uint8_t));

      frame->pc += 1 + sizeof(uint16_t) + sizeof(uint8_t) + argc * sizeof(uint16_t);
      apply(xvm, locals[target_reg], argc, args, locals);
      break;
    }

    case OP_TAIL_APPLY: {
      uint16_t target_reg; memory_load(frame->pc + 1, target_reg);
      uint8_t argc = frame->pc[1 + sizeof(uint16_t)];
      uint16_t *args =
        (uint16_t *) (frame->pc + 1 + sizeof(uint16_t) + sizeof(uint8_t));

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

      uint16_t apply_args[argc];
      for (size_t i = 0; i < argc; i++) {
        apply_args[i] = (uint16_t)(i + 1);
      }

      apply(xvm, target, argc, apply_args, tmp);

      for (size_t i = 0; i < count; i++) {
        xvm_drop_root(xvm);
      }
      continue;
    }

    case OP_JUMP: {
      int32_t offset; memory_load(frame->pc + 1, offset);
      frame->pc += 1 + sizeof(int32_t) + offset;
      break;
    }

    case OP_JUMP_IF_NOT: {
      uint16_t src; memory_load(frame->pc + 1, src);
      int32_t offset; memory_load(frame->pc + 1 + sizeof(uint16_t), offset);
      frame->pc += 1 + sizeof(uint16_t) + sizeof(int32_t);
      if (locals[src] == x_false) {
        frame->pc += offset;
      }
      break;
    }
    }
  }
}


static void xvm_gc_roots_in_frame_buffer(xvm_t *xvm, array_t *roots) {
  uint8_t *raw = buffer_raw_bytes(xvm->frame_buffer);
  size_t sp = xvm->frame_sp;

  for (size_t i = 0; i < xvm->frame_count; i++) {
    frame_t *frame = (frame_t *)(raw + sp);
    value_t *locals = frame_locals(frame);
    for (size_t j = 0; j < frame->local_count; j++) {
      if (object_p(locals[j])) {
        array_push(roots, to_object(locals[j]));
      }
    }
    sp = frame->prev_sp;
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
  xvm_gc_roots_in_frame_buffer(xvm, roots);
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

  uint8_t *raw = buffer_raw_bytes(xvm->frame_buffer);
  size_t sp = xvm->frame_sp;

  for (size_t i = 0; i < xvm->frame_count; i++) {
    frame_t *frame = (frame_t *)(raw + sp);
    value_t *locals = frame_locals(frame);
    print_string("[");
    for (size_t j = 0; j < frame->local_count; j++) {
      print_value(locals[j]);
      print_string(" ");
    }
    print_string("] ");
    sp = frame->prev_sp;
  }

  print_string("\n");
}
