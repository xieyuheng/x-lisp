#pragma once

static inline void exec_tail_call_0(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  function_t *fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(function_t *));
  xvm_tail_call_replace(xvm, fn, 0, args);
}

static inline void exec_tail_call_1(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  function_t *fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(function_t *));
  xvm_tail_call_replace(xvm, fn, 1, args);
}

static inline void exec_tail_call_2(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  function_t *fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(function_t *));
  xvm_tail_call_replace(xvm, fn, 2, args);
}

static inline void exec_tail_call_3(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  function_t *fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(function_t *));
  xvm_tail_call_replace(xvm, fn, 3, args);
}

static inline void exec_tail_call_4(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  function_t *fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(function_t *));
  xvm_tail_call_replace(xvm, fn, 4, args);
}

static inline void exec_tail_call_5(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  function_t *fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(function_t *));
  xvm_tail_call_replace(xvm, fn, 5, args);
}

static inline void exec_tail_call_6(xvm_t *xvm, frame_t *frame, value_t *locals) {
  (void) locals;
  function_t *fn;
  memory_load(frame->pc + 1, fn);
  uint16_t *args = (uint16_t *)(frame->pc + 1 + sizeof(function_t *));
  xvm_tail_call_replace(xvm, fn, 6, args);
}
