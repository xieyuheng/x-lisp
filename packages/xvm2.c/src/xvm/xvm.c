#include "index.h"

typedef enum {
  OP_MOVE = 0x01,
  OP_LOAD_INT = 0x02,
  OP_LOAD_FLOAT = 0x03,
  OP_LOAD_STRING = 0x04,
  OP_LOAD_SYMBOL = 0x05,
  OP_LOAD_CLOSURE = 0x06,
  OP_MAKE_CLOSURE = 0x07,
  OP_STORE_CLOSURE_ARG = 0x08,
  OP_LOAD_RESULT = 0x09,
  OP_LOAD_GLOBAL = 0x0a,
  OP_STORE_GLOBAL = 0x0b,

  OP_CALL_0 = 0x10,
  OP_CALL_1 = 0x11,
  OP_CALL_2 = 0x12,
  OP_CALL_3 = 0x13,
  OP_CALL_4 = 0x14,
  OP_CALL_5 = 0x15,
  OP_CALL_6 = 0x16,
  OP_CALL_PRIM_0 = 0x17,
  OP_CALL_PRIM_1 = 0x18,
  OP_CALL_PRIM_2 = 0x19,
  OP_CALL_PRIM_3 = 0x1a,
  OP_CALL_PRIM_4 = 0x1b,
  OP_CALL_PRIM_5 = 0x1c,
  OP_CALL_PRIM_6 = 0x1d,
  OP_TAIL_CALL_0 = 0x1e,
  OP_TAIL_CALL_1 = 0x1f,
  OP_TAIL_CALL_2 = 0x20,
  OP_TAIL_CALL_3 = 0x21,
  OP_TAIL_CALL_4 = 0x22,
  OP_TAIL_CALL_5 = 0x23,
  OP_TAIL_CALL_6 = 0x24,
  OP_TAIL_CALL_PRIM_0 = 0x25,
  OP_TAIL_CALL_PRIM_1 = 0x26,
  OP_TAIL_CALL_PRIM_2 = 0x27,
  OP_TAIL_CALL_PRIM_3 = 0x28,
  OP_TAIL_CALL_PRIM_4 = 0x29,
  OP_TAIL_CALL_PRIM_5 = 0x2a,
  OP_TAIL_CALL_PRIM_6 = 0x2b,

  OP_APPLY_0 = 0x2c,
  OP_APPLY_1 = 0x2d,
  OP_APPLY_2 = 0x2e,
  OP_APPLY_3 = 0x2f,
  OP_APPLY_4 = 0x30,
  OP_APPLY_5 = 0x31,
  OP_APPLY_6 = 0x32,
  OP_TAIL_APPLY_0 = 0x33,
  OP_TAIL_APPLY_1 = 0x34,
  OP_TAIL_APPLY_2 = 0x35,
  OP_TAIL_APPLY_3 = 0x36,
  OP_TAIL_APPLY_4 = 0x37,
  OP_TAIL_APPLY_5 = 0x38,
  OP_TAIL_APPLY_6 = 0x39,

  OP_GOTO = 0x40,
  OP_BRANCH = 0x41,
  OP_RETURN = 0x42,
  OP_RETURN_VOID = 0x43,

  OP_IADD = 0x50,
  OP_ISUB = 0x51,
  OP_IMUL = 0x52,
  OP_IDIV = 0x53,
  OP_IMOD = 0x54,
  OP_INEG = 0x55,
  OP_INT_GREATER = 0x58,
  OP_INT_LESS = 0x59,
  OP_INT_GREATER_OR_EQUAL = 0x5a,
  OP_INT_LESS_OR_EQUAL = 0x5b,
  OP_INT_IS_POSITIVE = 0x5c,
  OP_INT_IS_NON_NEGATIVE = 0x5d,
  OP_INT_IS_NON_ZERO = 0x5e,

  OP_FADD = 0x70,
  OP_FSUB = 0x71,
  OP_FMUL = 0x72,
  OP_FDIV = 0x73,
  OP_FNEG = 0x74,
  OP_FLOAT_GREATER = 0x78,
  OP_FLOAT_LESS = 0x79,
  OP_FLOAT_GREATER_OR_EQUAL = 0x7a,
  OP_FLOAT_LESS_OR_EQUAL = 0x7b,
  OP_FLOAT_IS_POSITIVE = 0x7c,
  OP_FLOAT_IS_NON_NEGATIVE = 0x7d,
  OP_FLOAT_IS_NON_ZERO = 0x7e,
} op_t;

static void frame_stack_ensure(xvm_t *xvm, size_t length) {
  if (length <= xvm->frame_capacity) return;

  size_t capacity = xvm->frame_capacity == 0 ? 4096 : xvm->frame_capacity;
  while (capacity < length) {
    capacity *= 2;
  }

  xvm->frame_bytes = realloc(xvm->frame_bytes, capacity);
  xvm->frame_capacity = capacity;
}

xvm_t *make_xvm(program_t *program) {
  xvm_t *self = new(xvm_t);
  self->program = program;
  self->result = x_void;
  self->frame_bytes = NULL;
  self->frame_capacity = 0;
  self->frame_offset = 0;
  self->frame_top = 0;
  self->frame_count = 0;
  self->break_depth = 0;
  self->root_stack = make_stack();
  return self;
}

void xvm_free(xvm_t *self) {
  free(self->frame_bytes);
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
  return (frame_t *)(xvm->frame_bytes + xvm->frame_offset);
}

static inline void init_frame_header(frame_t *frame, function_t *fn, size_t prev_frame_offset) {
  frame->pc = fn->threaded_code + sizeof(void *);
  frame->prev_frame_offset = prev_frame_offset;
}

static inline frame_t *frame_start_push(xvm_t *xvm, function_t *fn) {
  frame_t *caller = xvm_current_frame(xvm);

  size_t new_offset = xvm->frame_top;
  size_t new_size = fn->frame_size;
  frame_stack_ensure(xvm, new_offset + new_size);

  frame_t *frame = (frame_t *)(xvm->frame_bytes + new_offset);
  init_frame_header(frame, fn, caller ? xvm->frame_offset : 0);

  xvm->frame_offset = new_offset;
  xvm->frame_top = new_offset + new_size;
  xvm->frame_count++;
  return frame;
}

static inline void xvm_push_function_frame_0(xvm_t *xvm, function_t *fn) {
  frame_t *frame = frame_start_push(xvm, fn);
  memory_clear(frame_locals(frame), fn->local_count * sizeof(value_t));
}

static inline void xvm_push_function_frame_1(xvm_t *xvm, function_t *fn, value_t a0) {
  frame_t *frame = frame_start_push(xvm, fn);
  value_t *locals = frame_locals(frame);
  locals[0] = a0;
  memory_clear(locals + 1, (fn->local_count - 1) * sizeof(value_t));
}

static inline void xvm_push_function_frame_2(xvm_t *xvm, function_t *fn, value_t a0, value_t a1) {
  frame_t *frame = frame_start_push(xvm, fn);
  value_t *locals = frame_locals(frame);
  locals[0] = a0;
  locals[1] = a1;
  memory_clear(locals + 2, (fn->local_count - 2) * sizeof(value_t));
}

static inline void xvm_push_function_frame_3(xvm_t *xvm, function_t *fn, value_t a0, value_t a1, value_t a2) {
  frame_t *frame = frame_start_push(xvm, fn);
  value_t *locals = frame_locals(frame);
  locals[0] = a0;
  locals[1] = a1;
  locals[2] = a2;
  memory_clear(locals + 3, (fn->local_count - 3) * sizeof(value_t));
}

static inline void xvm_push_function_frame_4(xvm_t *xvm, function_t *fn, value_t a0, value_t a1, value_t a2, value_t a3) {
  frame_t *frame = frame_start_push(xvm, fn);
  value_t *locals = frame_locals(frame);
  locals[0] = a0;
  locals[1] = a1;
  locals[2] = a2;
  locals[3] = a3;
  memory_clear(locals + 4, (fn->local_count - 4) * sizeof(value_t));
}

static inline void xvm_push_function_frame_5(xvm_t *xvm, function_t *fn, value_t a0, value_t a1, value_t a2, value_t a3, value_t a4) {
  frame_t *frame = frame_start_push(xvm, fn);
  value_t *locals = frame_locals(frame);
  locals[0] = a0;
  locals[1] = a1;
  locals[2] = a2;
  locals[3] = a3;
  locals[4] = a4;
  memory_clear(locals + 5, (fn->local_count - 5) * sizeof(value_t));
}

static inline void xvm_push_function_frame_6(xvm_t *xvm, function_t *fn, value_t a0, value_t a1, value_t a2, value_t a3, value_t a4, value_t a5) {
  frame_t *frame = frame_start_push(xvm, fn);
  value_t *locals = frame_locals(frame);
  locals[0] = a0;
  locals[1] = a1;
  locals[2] = a2;
  locals[3] = a3;
  locals[4] = a4;
  locals[5] = a5;
  memory_clear(locals + 6, (fn->local_count - 6) * sizeof(value_t));
}

void xvm_push_function_frame(xvm_t *xvm, function_t *fn,
                             uint8_t argc, const uint16_t *args) {
  frame_t *caller = xvm_current_frame(xvm);
  frame_t *frame = frame_start_push(xvm, fn);

  value_t *locals = frame_locals(frame);
  if (args && caller) {
    value_t *caller_locals = frame_locals(caller);
    for (size_t i = 0; i < argc; i++) {
      locals[i] = caller_locals[args[i]];
    }
  }

  memory_clear(locals + argc, (fn->local_count - argc) * sizeof(value_t));
}

void xvm_push_function_frame_with_values(xvm_t *xvm, function_t *fn,
                                          size_t argc, value_t *values) {
  frame_t *frame = frame_start_push(xvm, fn);

  value_t *locals = frame_locals(frame);
  for (size_t i = 0; i < argc && i < fn->local_count; i++) {
    locals[i] = values[i];
  }

  memory_clear(locals + argc, (fn->local_count - argc) * sizeof(value_t));
}

void xvm_pop_frame(xvm_t *xvm) {
  frame_t *current = xvm_current_frame(xvm);
  xvm->frame_top = xvm->frame_offset;
  xvm->frame_offset = current->prev_frame_offset;
  xvm->frame_count--;
  xvm_gc_maybe_collect(xvm);
}

static void xvm_tail_call_replace(xvm_t *xvm, function_t *fn,
                                   uint8_t argc, const uint16_t *args) {
  frame_t *current = xvm_current_frame(xvm);
  size_t prev_frame_offset = current->prev_frame_offset;

  value_t saved[argc > 0 ? argc : 1];
  if (args) {
    value_t *current_locals = frame_locals(current);
    for (size_t i = 0; i < argc; i++) {
      saved[i] = current_locals[args[i]];
    }
  }

  size_t current_start = xvm->frame_offset;
  size_t old_size = xvm->frame_top - current_start;
  size_t new_size = fn->frame_size;
  size_t new_end = current_start + new_size;

  if (new_size > old_size) {
    frame_stack_ensure(xvm, new_end);
  }

  frame_t *frame = (frame_t *)(xvm->frame_bytes + current_start);
  init_frame_header(frame, fn, prev_frame_offset);

  value_t *locals = frame_locals(frame);
  if (args) {
    for (size_t i = 0; i < argc; i++) {
      locals[i] = saved[i];
    }
  }

  memory_clear(locals + argc, (fn->local_count - argc) * sizeof(value_t));

  xvm->frame_offset = current_start;
  xvm->frame_top = new_end;
}

static uint8_t call_argc(uint8_t op) {
  if (op >= OP_CALL_0 && op <= OP_CALL_6) return op - OP_CALL_0;
  if (op >= OP_CALL_PRIM_0 && op <= OP_CALL_PRIM_6) return op - OP_CALL_PRIM_0;
  if (op >= OP_TAIL_CALL_0 && op <= OP_TAIL_CALL_6) return op - OP_TAIL_CALL_0;
  if (op >= OP_TAIL_CALL_PRIM_0 && op <= OP_TAIL_CALL_PRIM_6) return op - OP_TAIL_CALL_PRIM_0;
  if (op >= OP_APPLY_0 && op <= OP_APPLY_6) return op - OP_APPLY_0;
  if (op >= OP_TAIL_APPLY_0 && op <= OP_TAIL_APPLY_6) return op - OP_TAIL_APPLY_0;
  return 0;
}

static inline void exec_move(frame_t *frame, value_t *locals) {
  uint16_t dest; memory_load(frame->pc + 1, dest);
  uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src);
  locals[dest] = locals[src];
  frame->pc += 1 + sizeof(uint16_t) + sizeof(uint16_t);
}

static inline void exec_load_value(frame_t *frame, value_t *locals) {
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

static inline void exec_load_closure(frame_t *frame, value_t *locals) {
  uint16_t dest; function_t *fn;
  memory_load(frame->pc + 1, dest);
  memory_load(frame->pc + 1 + sizeof(uint16_t), fn);
  closure_t *closure = make_closure(fn, 0);
  locals[dest] = x_object(closure);
  frame->pc += 1 + sizeof(uint16_t) + sizeof(function_t *);
}

static inline void exec_make_closure(frame_t *frame, value_t *locals) {
  uint16_t dest; function_t *fn; uint16_t size;
  memory_load(frame->pc + 1, dest);
  memory_load(frame->pc + 1 + sizeof(uint16_t), fn);
  memory_load(frame->pc + 1 + sizeof(uint16_t) + sizeof(function_t *), size);
  closure_t *closure = make_closure(fn, size);
  locals[dest] = x_object(closure);
  frame->pc += 1 + sizeof(uint16_t) + sizeof(function_t *) + sizeof(uint16_t);
}

static inline void exec_store_closure_arg(frame_t *frame, value_t *locals) {
  uint16_t closure_reg; uint16_t index; uint16_t src;
  memory_load(frame->pc + 1, closure_reg);
  memory_load(frame->pc + 1 + sizeof(uint16_t), index);
  memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src);
  closure_t *closure = to_closure(locals[closure_reg]);
  closure->args[index] = locals[src];
  frame->pc += 1 + 3 * sizeof(uint16_t);
}

static inline void exec_load_global(frame_t *frame, value_t *locals) {
  uint16_t dest; value_t *target;
  memory_load(frame->pc + 1, dest);
  memory_load(frame->pc + 1 + sizeof(uint16_t), target);
  locals[dest] = *target;
  frame->pc += 1 + sizeof(uint16_t) + sizeof(value_t *);
}

static inline void exec_store_global(frame_t *frame, value_t *locals) {
  value_t *target; uint16_t src;
  memory_load(frame->pc + 1, target);
  memory_load(frame->pc + 1 + sizeof(value_t *), src);
  *target = locals[src];
  frame->pc += 1 + sizeof(value_t *) + sizeof(uint16_t);
}

static inline void exec_return(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t src; memory_load(frame->pc + 1, src);
  xvm->result = locals[src];
  xvm_pop_frame(xvm);
}

static inline void exec_return_void(xvm_t *xvm, frame_t *frame) {
  (void) frame;
  xvm->result = x_void;
  xvm_pop_frame(xvm);
}

static inline void exec_call_0(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  function_t *fn;
  memory_load(frame->pc + 1, fn);
  frame->pc += 1 + sizeof(function_t *) + sizeof(void *);
  xvm_push_function_frame_0(xvm, fn);
}

static inline void exec_call_1(xvm_t *xvm, frame_t *frame, value_t *locals) {
  function_t *fn;
  uint16_t a0;
  memory_load(frame->pc + 1, fn);
  memory_load(frame->pc + 1 + sizeof(function_t *), a0);
  value_t v0 = locals[a0];
  frame->pc += 1 + sizeof(function_t *) + 1 * sizeof(uint16_t) + sizeof(void *);
  xvm_push_function_frame_1(xvm, fn, v0);
}

static inline void exec_call_2(xvm_t *xvm, frame_t *frame, value_t *locals) {
  function_t *fn;
  uint16_t a0, a1;
  memory_load(frame->pc + 1, fn);
  memory_load(frame->pc + 1 + sizeof(function_t *), a0);
  memory_load(frame->pc + 1 + sizeof(function_t *) + sizeof(uint16_t), a1);
  value_t v0 = locals[a0];
  value_t v1 = locals[a1];
  frame->pc += 1 + sizeof(function_t *) + 2 * sizeof(uint16_t) + sizeof(void *);
  xvm_push_function_frame_2(xvm, fn, v0, v1);
}

static inline void exec_call_3(xvm_t *xvm, frame_t *frame, value_t *locals) {
  function_t *fn;
  uint16_t a0, a1, a2;
  memory_load(frame->pc + 1, fn);
  memory_load(frame->pc + 1 + sizeof(function_t *), a0);
  memory_load(frame->pc + 1 + sizeof(function_t *) + sizeof(uint16_t), a1);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 2 * sizeof(uint16_t), a2);
  value_t v0 = locals[a0];
  value_t v1 = locals[a1];
  value_t v2 = locals[a2];
  frame->pc += 1 + sizeof(function_t *) + 3 * sizeof(uint16_t) + sizeof(void *);
  xvm_push_function_frame_3(xvm, fn, v0, v1, v2);
}

static inline void exec_call_4(xvm_t *xvm, frame_t *frame, value_t *locals) {
  function_t *fn;
  uint16_t a0, a1, a2, a3;
  memory_load(frame->pc + 1, fn);
  memory_load(frame->pc + 1 + sizeof(function_t *), a0);
  memory_load(frame->pc + 1 + sizeof(function_t *) + sizeof(uint16_t), a1);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 2 * sizeof(uint16_t), a2);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 3 * sizeof(uint16_t), a3);
  value_t v0 = locals[a0];
  value_t v1 = locals[a1];
  value_t v2 = locals[a2];
  value_t v3 = locals[a3];
  frame->pc += 1 + sizeof(function_t *) + 4 * sizeof(uint16_t) + sizeof(void *);
  xvm_push_function_frame_4(xvm, fn, v0, v1, v2, v3);
}

static inline void exec_call_5(xvm_t *xvm, frame_t *frame, value_t *locals) {
  function_t *fn;
  uint16_t a0, a1, a2, a3, a4;
  memory_load(frame->pc + 1, fn);
  memory_load(frame->pc + 1 + sizeof(function_t *), a0);
  memory_load(frame->pc + 1 + sizeof(function_t *) + sizeof(uint16_t), a1);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 2 * sizeof(uint16_t), a2);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 3 * sizeof(uint16_t), a3);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 4 * sizeof(uint16_t), a4);
  value_t v0 = locals[a0];
  value_t v1 = locals[a1];
  value_t v2 = locals[a2];
  value_t v3 = locals[a3];
  value_t v4 = locals[a4];
  frame->pc += 1 + sizeof(function_t *) + 5 * sizeof(uint16_t) + sizeof(void *);
  xvm_push_function_frame_5(xvm, fn, v0, v1, v2, v3, v4);
}

static inline void exec_call_6(xvm_t *xvm, frame_t *frame, value_t *locals) {
  function_t *fn;
  uint16_t a0, a1, a2, a3, a4, a5;
  memory_load(frame->pc + 1, fn);
  memory_load(frame->pc + 1 + sizeof(function_t *), a0);
  memory_load(frame->pc + 1 + sizeof(function_t *) + sizeof(uint16_t), a1);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 2 * sizeof(uint16_t), a2);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 3 * sizeof(uint16_t), a3);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 4 * sizeof(uint16_t), a4);
  memory_load(frame->pc + 1 + sizeof(function_t *) + 5 * sizeof(uint16_t), a5);
  value_t v0 = locals[a0];
  value_t v1 = locals[a1];
  value_t v2 = locals[a2];
  value_t v3 = locals[a3];
  value_t v4 = locals[a4];
  value_t v5 = locals[a5];
  frame->pc += 1 + sizeof(function_t *) + 6 * sizeof(uint16_t) + sizeof(void *);
  xvm_push_function_frame_6(xvm, fn, v0, v1, v2, v3, v4, v5);
}

static inline void exec_call_prim_n(xvm_t *xvm, frame_t *frame, value_t *locals, uint8_t argc) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(primitive_fn_t));
  frame->pc += 1 + sizeof(primitive_fn_t) + argc * sizeof(uint16_t);
  call_primitive(xvm, locals, fn, argc, args);
}

static inline void exec_tail_call_n(xvm_t *xvm, frame_t *frame, value_t *locals, uint8_t argc) {
  (void) locals;
  function_t *fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(function_t *));
  xvm_tail_call_replace(xvm, fn, argc, args);
}

static inline void exec_tail_call_prim_n(xvm_t *xvm, frame_t *frame, value_t *locals, uint8_t argc) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(primitive_fn_t));
  call_primitive(xvm, locals, fn, argc, args);
  xvm_pop_frame(xvm);
}

static inline void exec_apply_n(xvm_t *xvm, frame_t *frame, value_t *locals, uint8_t argc) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(uint16_t));
  frame->pc += 1 + sizeof(uint16_t) + argc * sizeof(uint16_t);
  frame->pc += sizeof(void *);
  apply(xvm, locals[target_reg], argc, args, locals);
}

static inline void exec_tail_apply_n(xvm_t *xvm, frame_t *frame, value_t *locals, uint8_t argc) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(uint16_t));

  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("tail-apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
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

  // after popping, push the target function frame.
  xvm_push_function_frame_with_values(xvm, closure->function, count, tmp);

  for (size_t i = 0; i < count; i++) {
    xvm_drop_root(xvm);
  }
}

static inline void exec_jump(frame_t *frame) {
  int32_t offset; memory_load(frame->pc + 1, offset);
  frame->pc += 1 + sizeof(int32_t) + offset;
}

static inline void exec_branch(frame_t *frame, value_t *locals) {
  uint16_t src; memory_load(frame->pc + 1, src);
  int32_t then_offset; memory_load(frame->pc + 1 + sizeof(uint16_t), then_offset);
  int32_t else_offset; memory_load(frame->pc + 1 + sizeof(uint16_t) + sizeof(int32_t), else_offset);
  frame->pc += 1 + sizeof(uint16_t) + 2 * sizeof(int32_t);
  if (locals[src] != x_false) {
    frame->pc += then_offset;
  } else {
    frame->pc += else_offset;
  }
}

#define DEFINE_BINARY_OP(name, func) \
static inline void exec_##name(frame_t *frame, value_t *locals) { \
  uint16_t dest; memory_load(frame->pc + 1, dest); \
  uint16_t src1; memory_load(frame->pc + 1 + sizeof(uint16_t), src1); \
  uint16_t src2; memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), src2); \
  locals[dest] = func(locals[src1], locals[src2]); \
  frame->pc += 1 + 3 * sizeof(uint16_t); \
}

#define DEFINE_UNARY_OP(name, func) \
static inline void exec_##name(frame_t *frame, value_t *locals) { \
  uint16_t dest; memory_load(frame->pc + 1, dest); \
  uint16_t src; memory_load(frame->pc + 1 + sizeof(uint16_t), src); \
  locals[dest] = func(locals[src]); \
  frame->pc += 1 + 2 * sizeof(uint16_t); \
}

DEFINE_BINARY_OP(iadd, x_iadd)
DEFINE_BINARY_OP(isub, x_isub)
DEFINE_BINARY_OP(imul, x_imul)
DEFINE_BINARY_OP(idiv, x_idiv)
DEFINE_BINARY_OP(imod, x_imod)
DEFINE_BINARY_OP(int_greater, x_int_greater)
DEFINE_BINARY_OP(int_less, x_int_less)
DEFINE_BINARY_OP(int_greater_or_equal, x_int_greater_or_equal)
DEFINE_BINARY_OP(int_less_or_equal, x_int_less_or_equal)
DEFINE_UNARY_OP(ineg, x_ineg)
DEFINE_UNARY_OP(int_is_positive, x_int_positive)
DEFINE_UNARY_OP(int_is_non_negative, x_int_non_negative)
DEFINE_UNARY_OP(int_is_non_zero, x_int_non_zero)

DEFINE_BINARY_OP(fadd, x_fadd)
DEFINE_BINARY_OP(fsub, x_fsub)
DEFINE_BINARY_OP(fmul, x_fmul)
DEFINE_BINARY_OP(fdiv, x_fdiv)
DEFINE_BINARY_OP(float_greater, x_float_greater)
DEFINE_BINARY_OP(float_less, x_float_less)
DEFINE_BINARY_OP(float_greater_or_equal, x_float_greater_or_equal)
DEFINE_BINARY_OP(float_less_or_equal, x_float_less_or_equal)
DEFINE_UNARY_OP(fneg, x_fneg)
DEFINE_UNARY_OP(float_is_positive, x_float_positive)
DEFINE_UNARY_OP(float_is_non_negative, x_float_non_negative)
DEFINE_UNARY_OP(float_is_non_zero, x_float_non_zero)

static size_t instruction_operand_size(uint8_t op) {
  switch (op) {
  case OP_MOVE: return 2 + 2;
  case OP_LOAD_INT:
  case OP_LOAD_FLOAT:
  case OP_LOAD_STRING:
  case OP_LOAD_SYMBOL:
  case OP_LOAD_CLOSURE:
  case OP_LOAD_GLOBAL: return 2 + 8;
  case OP_MAKE_CLOSURE: return 2 + 8 + 2;
  case OP_STORE_CLOSURE_ARG: return 2 + 2 + 2;
  case OP_LOAD_RESULT: return 2;
  case OP_STORE_GLOBAL: return 8 + 2;
  case OP_CALL_0:
  case OP_CALL_1:
  case OP_CALL_2:
  case OP_CALL_3:
  case OP_CALL_4:
  case OP_CALL_5:
  case OP_CALL_6:
  case OP_CALL_PRIM_0:
  case OP_CALL_PRIM_1:
  case OP_CALL_PRIM_2:
  case OP_CALL_PRIM_3:
  case OP_CALL_PRIM_4:
  case OP_CALL_PRIM_5:
  case OP_CALL_PRIM_6:
  case OP_TAIL_CALL_0:
  case OP_TAIL_CALL_1:
  case OP_TAIL_CALL_2:
  case OP_TAIL_CALL_3:
  case OP_TAIL_CALL_4:
  case OP_TAIL_CALL_5:
  case OP_TAIL_CALL_6:
  case OP_TAIL_CALL_PRIM_0:
  case OP_TAIL_CALL_PRIM_1:
  case OP_TAIL_CALL_PRIM_2:
  case OP_TAIL_CALL_PRIM_3:
  case OP_TAIL_CALL_PRIM_4:
  case OP_TAIL_CALL_PRIM_5:
  case OP_TAIL_CALL_PRIM_6: return 8 + call_argc(op) * 2;
  case OP_APPLY_0:
  case OP_APPLY_1:
  case OP_APPLY_2:
  case OP_APPLY_3:
  case OP_APPLY_4:
  case OP_APPLY_5:
  case OP_APPLY_6:
  case OP_TAIL_APPLY_0:
  case OP_TAIL_APPLY_1:
  case OP_TAIL_APPLY_2:
  case OP_TAIL_APPLY_3:
  case OP_TAIL_APPLY_4:
  case OP_TAIL_APPLY_5:
  case OP_TAIL_APPLY_6: return 2 + call_argc(op) * 2;
  case OP_GOTO: return 4;
  case OP_BRANCH: return 2 + 4 + 4;
  case OP_RETURN: return 2;
  case OP_RETURN_VOID: return 0;
  case OP_IADD:
  case OP_ISUB:
  case OP_IMUL:
  case OP_IDIV:
  case OP_IMOD:
  case OP_INT_GREATER:
  case OP_INT_LESS:
  case OP_INT_GREATER_OR_EQUAL:
  case OP_INT_LESS_OR_EQUAL:
  case OP_FADD:
  case OP_FSUB:
  case OP_FMUL:
  case OP_FDIV:
  case OP_FLOAT_GREATER:
  case OP_FLOAT_LESS:
  case OP_FLOAT_GREATER_OR_EQUAL:
  case OP_FLOAT_LESS_OR_EQUAL: return 2 + 2 + 2;
  case OP_INEG:
  case OP_INT_IS_POSITIVE:
  case OP_INT_IS_NON_NEGATIVE:
  case OP_INT_IS_NON_ZERO:
  case OP_FNEG:
  case OP_FLOAT_IS_POSITIVE:
  case OP_FLOAT_IS_NON_NEGATIVE:
  case OP_FLOAT_IS_NON_ZERO: return 2 + 2;
  default: {
    who_printf("unknown opcode for size: 0x%02x\n", op);
    exit(1);
  }
  }
}

static size_t find_threaded_offset(
  const size_t *orig_starts,
  const size_t *threaded_offsets,
  size_t count,
  size_t target
) {
  for (size_t i = 0; i < count; i++) {
    if (orig_starts[i] == target) return threaded_offsets[i];
  }
  who_printf("bad threaded jump target: %zu\n", target);
  exit(1);
}

static void function_build_threaded_code(function_t *fn) {
  if (fn->bytecode == NULL || fn->code_length == 0) {
    fn->threaded_code = NULL;
    fn->threaded_code_length = 0;
    fn->threaded_ready = false;
    return;
  }

  size_t count = 0;
  size_t pos = 0;
  while (pos < fn->code_length) {
    count += 1;
    pos += 1 + instruction_operand_size(fn->bytecode[pos]);
  }

  size_t *orig_starts = allocate(sizeof(size_t) * count);
  size_t *threaded_offsets = allocate(sizeof(size_t) * count);
  size_t threaded_len = fn->code_length + count * sizeof(void *);
  uint8_t *threaded = allocate(threaded_len);

  pos = 0;
  size_t out = 0;
  for (size_t i = 0; i < count; i++) {
    uint8_t op = fn->bytecode[pos];
    size_t opsz = instruction_operand_size(op);
    orig_starts[i] = pos;
    threaded_offsets[i] = out + sizeof(void *);
    pos += 1 + opsz;
    out += sizeof(void *) + 1 + opsz;
  }

  pos = 0;
  out = 0;
  for (size_t i = 0; i < count; i++) {
    uint8_t op = fn->bytecode[pos];
    size_t opsz = instruction_operand_size(op);

    // handler pointer slot is left zero; filled lazily at first threaded run.
    threaded[out + sizeof(void *)] = op;
    memory_copy(threaded + out + sizeof(void *) + 1, fn->bytecode + pos + 1, opsz);

    if (op == OP_GOTO) {
      int32_t orig_offset;
      memory_load(fn->bytecode + pos + 1, orig_offset);
      size_t orig_target = pos + 1 + opsz + (size_t) orig_offset;
      size_t threaded_target = find_threaded_offset(orig_starts, threaded_offsets, count, orig_target);
      int32_t new_offset = (int32_t) (threaded_target - (out + sizeof(void *) + 1 + opsz));
      memory_store(threaded + out + sizeof(void *) + 1, new_offset);
    }

    if (op == OP_BRANCH) {
      int32_t orig_then;
      int32_t orig_else;
      memory_load(fn->bytecode + pos + 1 + 2, orig_then);
      memory_load(fn->bytecode + pos + 1 + 2 + 4, orig_else);

      size_t orig_then_target = pos + 1 + opsz + (size_t) orig_then;
      size_t orig_else_target = pos + 1 + opsz + (size_t) orig_else;
      size_t threaded_then = find_threaded_offset(orig_starts, threaded_offsets, count, orig_then_target);
      size_t threaded_else = find_threaded_offset(orig_starts, threaded_offsets, count, orig_else_target);

      int32_t new_then = (int32_t) (threaded_then - (out + sizeof(void *) + 1 + opsz));
      int32_t new_else = (int32_t) (threaded_else - (out + sizeof(void *) + 1 + opsz));
      memory_store(threaded + out + sizeof(void *) + 1 + 2, new_then);
      memory_store(threaded + out + sizeof(void *) + 1 + 2 + 4, new_else);
    }

    pos += 1 + opsz;
    out += sizeof(void *) + 1 + opsz;
  }

  free(orig_starts);
  free(threaded_offsets);

  fn->threaded_code = threaded;
  fn->threaded_code_length = threaded_len;
  fn->threaded_ready = false;
}

void program_build_threaded_codes(program_t *program) {
  record_iter_t iter;
  record_iter_init(&iter, program->functions);
  function_t *fn = record_iter_next_value(&iter);
  while (fn) {
    function_build_threaded_code(fn);
    fn = record_iter_next_value(&iter);
  }
}

static void *threaded_handlers[256];
static bool threaded_handlers_ready = false;

static void ensure_threaded_function(function_t *fn) {
  if (fn->threaded_ready) return;

  uint8_t *p = fn->threaded_code;
  uint8_t *end = fn->threaded_code + fn->threaded_code_length;
  while (p < end) {
    uint8_t op = p[sizeof(void *)];
    void *handler = threaded_handlers[op];
    memory_copy(p, &handler, sizeof(handler));
    p += sizeof(void *) + 1 + instruction_operand_size(op);
  }

  fn->threaded_ready = true;
}

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wpedantic"

#define TH_DISPATCH() goto *((void **)(frame->pc - sizeof(void *)))[0]
#define TH_NEXT() goto *((void **)(frame->pc - sizeof(void *)))[0]

void xvm_execute(xvm_t *xvm) {
  if (!threaded_handlers_ready) {
    threaded_handlers[OP_MOVE] = &&th_move;
    threaded_handlers[OP_LOAD_INT] = &&th_load_value;
    threaded_handlers[OP_LOAD_FLOAT] = &&th_load_value;
    threaded_handlers[OP_LOAD_STRING] = &&th_load_value;
    threaded_handlers[OP_LOAD_SYMBOL] = &&th_load_value;
    threaded_handlers[OP_LOAD_CLOSURE] = &&th_load_closure;
    threaded_handlers[OP_MAKE_CLOSURE] = &&th_make_closure;
    threaded_handlers[OP_STORE_CLOSURE_ARG] = &&th_store_closure_arg;
    threaded_handlers[OP_LOAD_RESULT] = &&th_load_result;
    threaded_handlers[OP_LOAD_GLOBAL] = &&th_load_global;
    threaded_handlers[OP_STORE_GLOBAL] = &&th_store_global;
    threaded_handlers[OP_RETURN] = &&th_return;
    threaded_handlers[OP_RETURN_VOID] = &&th_return_void;

    threaded_handlers[OP_CALL_0] = &&th_call_0;
    threaded_handlers[OP_CALL_1] = &&th_call_1;
    threaded_handlers[OP_CALL_2] = &&th_call_2;
    threaded_handlers[OP_CALL_3] = &&th_call_3;
    threaded_handlers[OP_CALL_4] = &&th_call_4;
    threaded_handlers[OP_CALL_5] = &&th_call_5;
    threaded_handlers[OP_CALL_6] = &&th_call_6;
    threaded_handlers[OP_CALL_PRIM_0] = &&th_call_prim_0;
    threaded_handlers[OP_CALL_PRIM_1] = &&th_call_prim_1;
    threaded_handlers[OP_CALL_PRIM_2] = &&th_call_prim_2;
    threaded_handlers[OP_CALL_PRIM_3] = &&th_call_prim_3;
    threaded_handlers[OP_CALL_PRIM_4] = &&th_call_prim_4;
    threaded_handlers[OP_CALL_PRIM_5] = &&th_call_prim_5;
    threaded_handlers[OP_CALL_PRIM_6] = &&th_call_prim_6;
    threaded_handlers[OP_TAIL_CALL_0] = &&th_tail_call_0;
    threaded_handlers[OP_TAIL_CALL_1] = &&th_tail_call_1;
    threaded_handlers[OP_TAIL_CALL_2] = &&th_tail_call_2;
    threaded_handlers[OP_TAIL_CALL_3] = &&th_tail_call_3;
    threaded_handlers[OP_TAIL_CALL_4] = &&th_tail_call_4;
    threaded_handlers[OP_TAIL_CALL_5] = &&th_tail_call_5;
    threaded_handlers[OP_TAIL_CALL_6] = &&th_tail_call_6;
    threaded_handlers[OP_TAIL_CALL_PRIM_0] = &&th_tail_call_prim_0;
    threaded_handlers[OP_TAIL_CALL_PRIM_1] = &&th_tail_call_prim_1;
    threaded_handlers[OP_TAIL_CALL_PRIM_2] = &&th_tail_call_prim_2;
    threaded_handlers[OP_TAIL_CALL_PRIM_3] = &&th_tail_call_prim_3;
    threaded_handlers[OP_TAIL_CALL_PRIM_4] = &&th_tail_call_prim_4;
    threaded_handlers[OP_TAIL_CALL_PRIM_5] = &&th_tail_call_prim_5;
    threaded_handlers[OP_TAIL_CALL_PRIM_6] = &&th_tail_call_prim_6;
    threaded_handlers[OP_APPLY_0] = &&th_apply_0;
    threaded_handlers[OP_APPLY_1] = &&th_apply_1;
    threaded_handlers[OP_APPLY_2] = &&th_apply_2;
    threaded_handlers[OP_APPLY_3] = &&th_apply_3;
    threaded_handlers[OP_APPLY_4] = &&th_apply_4;
    threaded_handlers[OP_APPLY_5] = &&th_apply_5;
    threaded_handlers[OP_APPLY_6] = &&th_apply_6;
    threaded_handlers[OP_TAIL_APPLY_0] = &&th_tail_apply_0;
    threaded_handlers[OP_TAIL_APPLY_1] = &&th_tail_apply_1;
    threaded_handlers[OP_TAIL_APPLY_2] = &&th_tail_apply_2;
    threaded_handlers[OP_TAIL_APPLY_3] = &&th_tail_apply_3;
    threaded_handlers[OP_TAIL_APPLY_4] = &&th_tail_apply_4;
    threaded_handlers[OP_TAIL_APPLY_5] = &&th_tail_apply_5;
    threaded_handlers[OP_TAIL_APPLY_6] = &&th_tail_apply_6;

    threaded_handlers[OP_GOTO] = &&th_goto;
    threaded_handlers[OP_BRANCH] = &&th_branch;

    threaded_handlers[OP_IADD] = &&th_iadd;
    threaded_handlers[OP_ISUB] = &&th_isub;
    threaded_handlers[OP_IMUL] = &&th_imul;
    threaded_handlers[OP_IDIV] = &&th_idiv;
    threaded_handlers[OP_IMOD] = &&th_imod;
    threaded_handlers[OP_INEG] = &&th_ineg;
    threaded_handlers[OP_INT_GREATER] = &&th_int_greater;
    threaded_handlers[OP_INT_LESS] = &&th_int_less;
    threaded_handlers[OP_INT_GREATER_OR_EQUAL] = &&th_int_greater_or_equal;
    threaded_handlers[OP_INT_LESS_OR_EQUAL] = &&th_int_less_or_equal;
    threaded_handlers[OP_INT_IS_POSITIVE] = &&th_int_is_positive;
    threaded_handlers[OP_INT_IS_NON_NEGATIVE] = &&th_int_is_non_negative;
    threaded_handlers[OP_INT_IS_NON_ZERO] = &&th_int_is_non_zero;

    threaded_handlers[OP_FADD] = &&th_fadd;
    threaded_handlers[OP_FSUB] = &&th_fsub;
    threaded_handlers[OP_FMUL] = &&th_fmul;
    threaded_handlers[OP_FDIV] = &&th_fdiv;
    threaded_handlers[OP_FNEG] = &&th_fneg;
    threaded_handlers[OP_FLOAT_GREATER] = &&th_float_greater;
    threaded_handlers[OP_FLOAT_LESS] = &&th_float_less;
    threaded_handlers[OP_FLOAT_GREATER_OR_EQUAL] = &&th_float_greater_or_equal;
    threaded_handlers[OP_FLOAT_LESS_OR_EQUAL] = &&th_float_less_or_equal;
    threaded_handlers[OP_FLOAT_IS_POSITIVE] = &&th_float_is_positive;
    threaded_handlers[OP_FLOAT_IS_NON_NEGATIVE] = &&th_float_is_non_negative;
    threaded_handlers[OP_FLOAT_IS_NON_ZERO] = &&th_float_is_non_zero;

    threaded_handlers_ready = true;
  }

  assert(xvm->break_depth <= xvm->frame_count);

  if (!xvm->program->threaded_codes_ready) {
    record_iter_t iter;
    record_iter_init(&iter, xvm->program->functions);
    function_t *fn = record_iter_next_value(&iter);
    while (fn) {
      ensure_threaded_function(fn);
      fn = record_iter_next_value(&iter);
    }
    xvm->program->threaded_codes_ready = true;
  }

  while (xvm->frame_count > xvm->break_depth) {
    frame_t *frame = xvm_current_frame(xvm);
    value_t *locals = frame_locals(frame);

    TH_DISPATCH();

    th_move: exec_move(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_load_value: exec_load_value(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_load_closure: exec_load_closure(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_make_closure: exec_make_closure(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_store_closure_arg: exec_store_closure_arg(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_load_result: exec_load_result(xvm, frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_load_global: exec_load_global(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_store_global: exec_store_global(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_return: exec_return(xvm, frame, locals); continue;
    th_return_void: exec_return_void(xvm, frame); continue;

    th_call_0: exec_call_0(xvm, frame, locals); continue;
    th_call_1: exec_call_1(xvm, frame, locals); continue;
    th_call_2: exec_call_2(xvm, frame, locals); continue;
    th_call_3: exec_call_3(xvm, frame, locals); continue;
    th_call_4: exec_call_4(xvm, frame, locals); continue;
    th_call_5: exec_call_5(xvm, frame, locals); continue;
    th_call_6: exec_call_6(xvm, frame, locals); continue;

    th_call_prim_0: exec_call_prim_n(xvm, frame, locals, 0); frame->pc += sizeof(void *); TH_NEXT();
    th_call_prim_1: exec_call_prim_n(xvm, frame, locals, 1); frame->pc += sizeof(void *); TH_NEXT();
    th_call_prim_2: exec_call_prim_n(xvm, frame, locals, 2); frame->pc += sizeof(void *); TH_NEXT();
    th_call_prim_3: exec_call_prim_n(xvm, frame, locals, 3); frame->pc += sizeof(void *); TH_NEXT();
    th_call_prim_4: exec_call_prim_n(xvm, frame, locals, 4); frame->pc += sizeof(void *); TH_NEXT();
    th_call_prim_5: exec_call_prim_n(xvm, frame, locals, 5); frame->pc += sizeof(void *); TH_NEXT();
    th_call_prim_6: exec_call_prim_n(xvm, frame, locals, 6); frame->pc += sizeof(void *); TH_NEXT();

    th_tail_call_0: exec_tail_call_n(xvm, frame, locals, 0); continue;
    th_tail_call_1: exec_tail_call_n(xvm, frame, locals, 1); continue;
    th_tail_call_2: exec_tail_call_n(xvm, frame, locals, 2); continue;
    th_tail_call_3: exec_tail_call_n(xvm, frame, locals, 3); continue;
    th_tail_call_4: exec_tail_call_n(xvm, frame, locals, 4); continue;
    th_tail_call_5: exec_tail_call_n(xvm, frame, locals, 5); continue;
    th_tail_call_6: exec_tail_call_n(xvm, frame, locals, 6); continue;

    th_tail_call_prim_0: exec_tail_call_prim_n(xvm, frame, locals, 0); continue;
    th_tail_call_prim_1: exec_tail_call_prim_n(xvm, frame, locals, 1); continue;
    th_tail_call_prim_2: exec_tail_call_prim_n(xvm, frame, locals, 2); continue;
    th_tail_call_prim_3: exec_tail_call_prim_n(xvm, frame, locals, 3); continue;
    th_tail_call_prim_4: exec_tail_call_prim_n(xvm, frame, locals, 4); continue;
    th_tail_call_prim_5: exec_tail_call_prim_n(xvm, frame, locals, 5); continue;
    th_tail_call_prim_6: exec_tail_call_prim_n(xvm, frame, locals, 6); continue;

    th_apply_0: exec_apply_n(xvm, frame, locals, 0); continue;
    th_apply_1: exec_apply_n(xvm, frame, locals, 1); continue;
    th_apply_2: exec_apply_n(xvm, frame, locals, 2); continue;
    th_apply_3: exec_apply_n(xvm, frame, locals, 3); continue;
    th_apply_4: exec_apply_n(xvm, frame, locals, 4); continue;
    th_apply_5: exec_apply_n(xvm, frame, locals, 5); continue;
    th_apply_6: exec_apply_n(xvm, frame, locals, 6); continue;

    th_tail_apply_0: exec_tail_apply_n(xvm, frame, locals, 0); continue;
    th_tail_apply_1: exec_tail_apply_n(xvm, frame, locals, 1); continue;
    th_tail_apply_2: exec_tail_apply_n(xvm, frame, locals, 2); continue;
    th_tail_apply_3: exec_tail_apply_n(xvm, frame, locals, 3); continue;
    th_tail_apply_4: exec_tail_apply_n(xvm, frame, locals, 4); continue;
    th_tail_apply_5: exec_tail_apply_n(xvm, frame, locals, 5); continue;
    th_tail_apply_6: exec_tail_apply_n(xvm, frame, locals, 6); continue;

    th_goto: exec_jump(frame); TH_NEXT();
    th_branch: exec_branch(frame, locals); TH_NEXT();

    th_iadd: exec_iadd(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_isub: exec_isub(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_imul: exec_imul(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_idiv: exec_idiv(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_imod: exec_imod(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_ineg: exec_ineg(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_int_greater: exec_int_greater(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_int_less: exec_int_less(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_int_greater_or_equal: exec_int_greater_or_equal(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_int_less_or_equal: exec_int_less_or_equal(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_int_is_positive: exec_int_is_positive(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_int_is_non_negative: exec_int_is_non_negative(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_int_is_non_zero: exec_int_is_non_zero(frame, locals); frame->pc += sizeof(void *); TH_NEXT();

    th_fadd: exec_fadd(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_fsub: exec_fsub(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_fmul: exec_fmul(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_fdiv: exec_fdiv(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_fneg: exec_fneg(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_float_greater: exec_float_greater(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_float_less: exec_float_less(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_float_greater_or_equal: exec_float_greater_or_equal(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_float_less_or_equal: exec_float_less_or_equal(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_float_is_positive: exec_float_is_positive(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_float_is_non_negative: exec_float_is_non_negative(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
    th_float_is_non_zero: exec_float_is_non_zero(frame, locals); frame->pc += sizeof(void *); TH_NEXT();
  }
}

#pragma GCC diagnostic pop


static void xvm_gc_roots_in_frame_buffer(xvm_t *xvm, array_t *roots) {
  frame_iter_t iter;
  frame_iter_init(&iter, xvm);
  frame_t *frame = frame_iter_next(&iter);
  while (frame) {
    value_t *locals = frame_locals(frame);
    size_t local_count = iter.local_count;
    for (size_t j = 0; j < local_count; j++) {
      if (is_object(locals[j])) {
        array_push(roots, to_object(locals[j]));
      }
    }
    frame = frame_iter_next(&iter);
  }
}

static void xvm_gc_roots_in_program(xvm_t *xvm, array_t *roots) {
  record_iter_t iter;
  record_iter_init(&iter, xvm_program(xvm)->variables);
  value_t *slot = record_iter_next_value(&iter);
  while (slot) {
    value_t value = *slot;
    if (is_object(value)) {
      array_push(roots, to_object(value));
    }
    slot = record_iter_next_value(&iter);
  }
}

static array_t *xvm_gc_roots(xvm_t *xvm) {
  array_t *roots = make_array();
  xvm_gc_roots_in_frame_buffer(xvm, roots);
  xvm_gc_roots_in_program(xvm, roots);

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
    size_t local_count = iter.local_count;
    print_string("[");
    for (size_t j = 0; j < local_count; j++) {
      print_value(locals[j]);
      print_string(" ");
    }
    print_string("] ");
    frame = frame_iter_next(&iter);
  }

  print_string("\n");
}
