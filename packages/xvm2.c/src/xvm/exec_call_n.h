#pragma once

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
