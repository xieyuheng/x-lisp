#include "index.h"

xvm_t *make_xvm(mod_t *mod) {
  xvm_t *self = new(xvm_t);
  self->mod = mod;
  self->result = x_void;
  self->frame_stack = make_stack_with((free_fn_t *) frame_free);
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

void call_primitive(xvm_t *xvm, value_t *locals,
                    const primitive_t *primitive, uint8_t argc, const uint16_t *args) {
  (void) argc;
  switch (primitive->fn_kind) {
  case X_FN_0: {
    xvm->result = primitive->fn_0();
    return;
  }

  case X_FN_1: {
    xvm->result = primitive->fn_1(locals[args[0]]);
    return;
  }

  case X_FN_2: {
    value_t x1 = locals[args[0]];
    value_t x2 = locals[args[1]];
    xvm->result = primitive->fn_2(x1, x2);
    return;
  }

  case X_FN_3: {
    value_t x1 = locals[args[0]];
    value_t x2 = locals[args[1]];
    value_t x3 = locals[args[2]];
    xvm->result = primitive->fn_3(x1, x2, x3);
    return;
  }

  case X_FN_4: {
    value_t x1 = locals[args[0]];
    value_t x2 = locals[args[1]];
    value_t x3 = locals[args[2]];
    value_t x4 = locals[args[3]];
    xvm->result = primitive->fn_4(x1, x2, x3, x4);
    return;
  }

  case X_FN_5: {
    value_t x1 = locals[args[0]];
    value_t x2 = locals[args[1]];
    value_t x3 = locals[args[2]];
    value_t x4 = locals[args[3]];
    value_t x5 = locals[args[4]];
    xvm->result = primitive->fn_5(x1, x2, x3, x4, x5);
    return;
  }

  case X_FN_6: {
    value_t x1 = locals[args[0]];
    value_t x2 = locals[args[1]];
    value_t x3 = locals[args[2]];
    value_t x4 = locals[args[3]];
    value_t x5 = locals[args[4]];
    value_t x6 = locals[args[5]];
    xvm->result = primitive->fn_6(x1, x2, x3, x4, x5, x6);
    return;
  }

  case X_FN_N: {
    unreachable();
  }
  }
}

#define LOCAL(index) (frame->locals[(index)])

void xvm_execute(xvm_t *xvm) {
  while (xvm_frame_count(xvm) > 0) {
    frame_t *frame = stack_top(xvm->frame_stack);
    if (frame->kind == BREAK_FRAME) {
      stack_pop(xvm->frame_stack);
      frame_free(frame);
      return;
    }

    switch (*frame->pc) {
    case OP_MOVE: {
      uint16_t dst; memory_load(frame->pc + 1, dst);
      uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src);
      LOCAL(dst) = LOCAL(src);
      frame->pc += 1 + sizeof(uint16_t) + sizeof(uint16_t);
      break;
    }

    case OP_LOAD: {
      uint16_t dst; memory_load(frame->pc + 1, dst);
      value_t value; memory_load(frame->pc + 1 + sizeof(uint16_t), value);
      LOCAL(dst) = value;
      frame->pc += 1 + sizeof(uint16_t) + sizeof(value_t);
      break;
    }

    case OP_LOAD_RESULT: {
      uint16_t dst; memory_load(frame->pc + 1, dst);
      LOCAL(dst) = xvm->result;
      frame->pc += 1 + sizeof(uint16_t);
      break;
    }

    case OP_RETURN: {
      uint16_t src; memory_load(frame->pc + 1, src);
      xvm->result = LOCAL(src);
      xvm_push_root(xvm, xvm->result);
      xvm_drop_frame(xvm);
      xvm_drop_root(xvm);
      continue;
    }

    case OP_CALL: {
      definition_t *def; memory_load(frame->pc + 1, def);
      uint8_t argc = frame->pc[1 + sizeof(definition_t *)];
      uint16_t *args =
        (uint16_t *) (frame->pc + 1 + sizeof(definition_t *) + sizeof(uint8_t));

      if (def->kind == PRIMITIVE_DEFINITION) {
        call_primitive(xvm, frame->locals, def->primitive_definition.primitive,
                       argc, args);
      } else if (def->kind == FUNCTION_DEFINITION) {
        call_function(xvm, definition_function(def), argc, args, frame->locals);
      } else {
        unreachable();
      }

      frame->pc += 1 + sizeof(definition_t *) + sizeof(uint8_t) + argc * sizeof(uint16_t);
      break;
    }

    case OP_TAIL_CALL: {
      definition_t *def; memory_load(frame->pc + 1, def);
      uint8_t argc = frame->pc[1 + sizeof(definition_t *)];
      uint16_t *args =
        (uint16_t *) (frame->pc + 1 + sizeof(definition_t *) + sizeof(uint8_t));

      if (def->kind == PRIMITIVE_DEFINITION) {
        call_primitive(xvm, frame->locals, def->primitive_definition.primitive,
                       argc, args);
        stack_pop(xvm->frame_stack);
        frame_free(frame);
      } else {
        const function_t *fn = definition_function(def);
        value_t saved[argc];
        for (size_t i = 0; i < argc; i++) {
          saved[i] = LOCAL(args[i]);
        }
        free(frame->locals);

        frame->code = buffer_raw_bytes(fn->buffer);
        frame->pc = frame->code;
        frame->local_count = fn->local_count;
        frame->locals = allocate(sizeof(value_t) * fn->local_count);
        frame->function_frame.function = fn;
        for (size_t i = 0; i < argc; i++) {
          frame->locals[i] = saved[i];
        }
      }
      continue;
    }

    case OP_REF: {
      uint16_t dst; memory_load(frame->pc + 1, dst);
      definition_t *def;
      memory_load(frame->pc + 1 + sizeof(uint16_t), def);
      LOCAL(dst) = x_object(def);
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
      LOCAL(dst) = def->variable_definition.value;
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
      def->variable_definition.value = LOCAL(src);
      frame->pc += 1 + sizeof(uint16_t) + sizeof(definition_t *);
      break;
    }

    case OP_APPLY: {
      uint16_t target_reg; memory_load(frame->pc + 1, target_reg);
      uint8_t argc = frame->pc[1 + sizeof(uint16_t)];
      uint16_t *args =
        (uint16_t *) (frame->pc + 1 + sizeof(uint16_t) + sizeof(uint8_t));

      apply(xvm, LOCAL(target_reg), argc, args, frame->locals);
      frame->pc += 1 + sizeof(uint16_t) + sizeof(uint8_t) + argc * sizeof(uint16_t);
      break;
    }

    case OP_TAIL_APPLY: {
      uint16_t target_reg; memory_load(frame->pc + 1, target_reg);
      uint8_t argc = frame->pc[1 + sizeof(uint16_t)];
      uint16_t *args =
        (uint16_t *) (frame->pc + 1 + sizeof(uint16_t) + sizeof(uint8_t));

      value_t target = LOCAL(target_reg);
      size_t count = (size_t)argc + 1;
      value_t *tmp = allocate(sizeof(value_t) * count);
      tmp[0] = target;
      for (size_t i = 0; i < argc; i++) {
        tmp[i + 1] = LOCAL(args[i]);
      }

      for (size_t i = 0; i < count; i++) {
        xvm_push_root(xvm, tmp[i]);
      }

      stack_pop(xvm->frame_stack);
      frame_free(frame);

      uint16_t apply_args[argc];
      for (size_t i = 0; i < argc; i++) {
        apply_args[i] = (uint16_t)(i + 1);
      }

      apply(xvm, target, argc, apply_args, tmp);

      free(tmp);
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
      if (LOCAL(src) == x_false) {
        frame->pc += offset;
      }
      break;
    }
    }
  }
}

#undef LOCAL

static void xvm_gc_roots_in_frame_stack(xvm_t *xvm, array_t *roots) {
  for (size_t i = 0; i < stack_length(xvm->frame_stack); i++) {
    frame_t *frame = stack_get(xvm->frame_stack, i);
    for (size_t j = 0; j < frame->local_count; j++) {
      value_t value = frame->locals[j];
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
