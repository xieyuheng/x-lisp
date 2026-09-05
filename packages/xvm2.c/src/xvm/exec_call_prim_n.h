#pragma once

static inline void exec_call_prim_0(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  frame->pc += 1 + sizeof(primitive_fn_t) + 0 * sizeof(uint16_t);
  xvm->result = ((x_fn_0_t *)fn)();
}

static inline void exec_call_prim_1(xvm_t *xvm, frame_t *frame, value_t *locals) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t), a0);
  frame->pc += 1 + sizeof(primitive_fn_t) + 1 * sizeof(uint16_t);
  xvm->result = ((x_fn_1_t *)fn)(locals[a0]);
}

static inline void exec_call_prim_2(xvm_t *xvm, frame_t *frame, value_t *locals) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 1 * sizeof(uint16_t), a1);
  frame->pc += 1 + sizeof(primitive_fn_t) + 2 * sizeof(uint16_t);
  xvm->result = ((x_fn_2_t *)fn)(locals[a0], locals[a1]);
}

static inline void exec_call_prim_3(xvm_t *xvm, frame_t *frame, value_t *locals) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 1 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 2 * sizeof(uint16_t), a2);
  frame->pc += 1 + sizeof(primitive_fn_t) + 3 * sizeof(uint16_t);
  xvm->result = ((x_fn_3_t *)fn)(locals[a0], locals[a1], locals[a2]);
}

static inline void exec_call_prim_4(xvm_t *xvm, frame_t *frame, value_t *locals) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 1 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 2 * sizeof(uint16_t), a2);
  uint16_t a3;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 3 * sizeof(uint16_t), a3);
  frame->pc += 1 + sizeof(primitive_fn_t) + 4 * sizeof(uint16_t);
  xvm->result = ((x_fn_4_t *)fn)(locals[a0], locals[a1], locals[a2], locals[a3]);
}

static inline void exec_call_prim_5(xvm_t *xvm, frame_t *frame, value_t *locals) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 1 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 2 * sizeof(uint16_t), a2);
  uint16_t a3;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 3 * sizeof(uint16_t), a3);
  uint16_t a4;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 4 * sizeof(uint16_t), a4);
  frame->pc += 1 + sizeof(primitive_fn_t) + 5 * sizeof(uint16_t);
  xvm->result = ((x_fn_5_t *)fn)(locals[a0], locals[a1], locals[a2], locals[a3], locals[a4]);
}

static inline void exec_call_prim_6(xvm_t *xvm, frame_t *frame, value_t *locals) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 1 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 2 * sizeof(uint16_t), a2);
  uint16_t a3;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 3 * sizeof(uint16_t), a3);
  uint16_t a4;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 4 * sizeof(uint16_t), a4);
  uint16_t a5;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 5 * sizeof(uint16_t), a5);
  frame->pc += 1 + sizeof(primitive_fn_t) + 6 * sizeof(uint16_t);
  xvm->result = ((x_fn_6_t *)fn)(locals[a0], locals[a1], locals[a2], locals[a3], locals[a4], locals[a5]);
}
