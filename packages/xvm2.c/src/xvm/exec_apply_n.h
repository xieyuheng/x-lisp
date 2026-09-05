#pragma once

static inline void exec_apply_0(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  frame->pc += 1 + sizeof(uint16_t) + 0 * sizeof(uint16_t) + sizeof(void *);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t values[1];
  values[0] = target;
  xvm_push_function_frame_with_values(xvm, closure->function, 1, values);
}

static inline void exec_apply_1(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(uint16_t), a0);
  frame->pc += 1 + sizeof(uint16_t) + 1 * sizeof(uint16_t) + sizeof(void *);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t values[2];
  values[0] = target;
  values[1] = locals[a0];
  xvm_push_function_frame_with_values(xvm, closure->function, 2, values);
}

static inline void exec_apply_2(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(uint16_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), a1);
  frame->pc += 1 + sizeof(uint16_t) + 2 * sizeof(uint16_t) + sizeof(void *);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t values[3];
  values[0] = target;
  values[1] = locals[a0];
  values[2] = locals[a1];
  xvm_push_function_frame_with_values(xvm, closure->function, 3, values);
}

static inline void exec_apply_3(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(uint16_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + 3 * sizeof(uint16_t), a2);
  frame->pc += 1 + sizeof(uint16_t) + 3 * sizeof(uint16_t) + sizeof(void *);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t values[4];
  values[0] = target;
  values[1] = locals[a0];
  values[2] = locals[a1];
  values[3] = locals[a2];
  xvm_push_function_frame_with_values(xvm, closure->function, 4, values);
}

static inline void exec_apply_4(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(uint16_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + 3 * sizeof(uint16_t), a2);
  uint16_t a3;
  memory_load(frame->pc + 1 + 4 * sizeof(uint16_t), a3);
  frame->pc += 1 + sizeof(uint16_t) + 4 * sizeof(uint16_t) + sizeof(void *);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t values[5];
  values[0] = target;
  values[1] = locals[a0];
  values[2] = locals[a1];
  values[3] = locals[a2];
  values[4] = locals[a3];
  xvm_push_function_frame_with_values(xvm, closure->function, 5, values);
}

static inline void exec_apply_5(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(uint16_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + 3 * sizeof(uint16_t), a2);
  uint16_t a3;
  memory_load(frame->pc + 1 + 4 * sizeof(uint16_t), a3);
  uint16_t a4;
  memory_load(frame->pc + 1 + 5 * sizeof(uint16_t), a4);
  frame->pc += 1 + sizeof(uint16_t) + 5 * sizeof(uint16_t) + sizeof(void *);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t values[6];
  values[0] = target;
  values[1] = locals[a0];
  values[2] = locals[a1];
  values[3] = locals[a2];
  values[4] = locals[a3];
  values[5] = locals[a4];
  xvm_push_function_frame_with_values(xvm, closure->function, 6, values);
}

static inline void exec_apply_6(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(uint16_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + 3 * sizeof(uint16_t), a2);
  uint16_t a3;
  memory_load(frame->pc + 1 + 4 * sizeof(uint16_t), a3);
  uint16_t a4;
  memory_load(frame->pc + 1 + 5 * sizeof(uint16_t), a4);
  uint16_t a5;
  memory_load(frame->pc + 1 + 6 * sizeof(uint16_t), a5);
  frame->pc += 1 + sizeof(uint16_t) + 6 * sizeof(uint16_t) + sizeof(void *);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t values[7];
  values[0] = target;
  values[1] = locals[a0];
  values[2] = locals[a1];
  values[3] = locals[a2];
  values[4] = locals[a3];
  values[5] = locals[a4];
  values[6] = locals[a5];
  xvm_push_function_frame_with_values(xvm, closure->function, 7, values);
}
