#pragma once

static inline void exec_tail_call_prim_0(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  xvm->result = ((x_fn_0_t *)fn)();
  xvm_pop_frame(xvm);
}

static inline void exec_tail_call_prim_1(xvm_t *xvm, frame_t *frame, value_t *locals) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t), a0);
  xvm->result = ((x_fn_1_t *)fn)(locals[a0]);
  xvm_pop_frame(xvm);
}

static inline void exec_tail_call_prim_2(xvm_t *xvm, frame_t *frame, value_t *locals) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 1 * sizeof(uint16_t), a1);
  xvm->result = ((x_fn_2_t *)fn)(locals[a0], locals[a1]);
  xvm_pop_frame(xvm);
}

static inline void exec_tail_call_prim_3(xvm_t *xvm, frame_t *frame, value_t *locals) {
  primitive_fn_t fn;
  memory_load(frame->pc + 1, fn);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 1 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + sizeof(primitive_fn_t) + 2 * sizeof(uint16_t), a2);
  xvm->result = ((x_fn_3_t *)fn)(locals[a0], locals[a1], locals[a2]);
  xvm_pop_frame(xvm);
}

static inline void exec_tail_call_prim_4(xvm_t *xvm, frame_t *frame, value_t *locals) {
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
  xvm->result = ((x_fn_4_t *)fn)(locals[a0], locals[a1], locals[a2], locals[a3]);
  xvm_pop_frame(xvm);
}

static inline void exec_tail_call_prim_5(xvm_t *xvm, frame_t *frame, value_t *locals) {
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
  xvm->result = ((x_fn_5_t *)fn)(locals[a0], locals[a1], locals[a2], locals[a3], locals[a4]);
  xvm_pop_frame(xvm);
}

static inline void exec_tail_call_prim_6(xvm_t *xvm, frame_t *frame, value_t *locals) {
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
  xvm->result = ((x_fn_6_t *)fn)(locals[a0], locals[a1], locals[a2], locals[a3], locals[a4], locals[a5]);
  xvm_pop_frame(xvm);
}
