#pragma once

static inline void exec_tail_apply_0(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("tail-apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t tmp[1];
  tmp[0] = target;
  xvm_push_root(xvm, tmp[0]);
  xvm_pop_frame(xvm);
  xvm_push_function_frame_with_values(xvm, closure->function, 1, tmp);
  xvm_drop_root(xvm);
}

static inline void exec_tail_apply_1(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(uint16_t), a0);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("tail-apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t tmp[2];
  tmp[0] = target;
  tmp[1] = locals[a0];
  xvm_push_root(xvm, tmp[0]);
  xvm_push_root(xvm, tmp[1]);
  xvm_pop_frame(xvm);
  xvm_push_function_frame_with_values(xvm, closure->function, 2, tmp);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
}

static inline void exec_tail_apply_2(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(uint16_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), a1);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("tail-apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t tmp[3];
  tmp[0] = target;
  tmp[1] = locals[a0];
  tmp[2] = locals[a1];
  xvm_push_root(xvm, tmp[0]);
  xvm_push_root(xvm, tmp[1]);
  xvm_push_root(xvm, tmp[2]);
  xvm_pop_frame(xvm);
  xvm_push_function_frame_with_values(xvm, closure->function, 3, tmp);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
}

static inline void exec_tail_apply_3(xvm_t *xvm, frame_t *frame, value_t *locals) {
  uint16_t target_reg;
  memory_load(frame->pc + 1, target_reg);
  uint16_t a0;
  memory_load(frame->pc + 1 + sizeof(uint16_t), a0);
  uint16_t a1;
  memory_load(frame->pc + 1 + 2 * sizeof(uint16_t), a1);
  uint16_t a2;
  memory_load(frame->pc + 1 + 3 * sizeof(uint16_t), a2);
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("tail-apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t tmp[4];
  tmp[0] = target;
  tmp[1] = locals[a0];
  tmp[2] = locals[a1];
  tmp[3] = locals[a2];
  xvm_push_root(xvm, tmp[0]);
  xvm_push_root(xvm, tmp[1]);
  xvm_push_root(xvm, tmp[2]);
  xvm_push_root(xvm, tmp[3]);
  xvm_pop_frame(xvm);
  xvm_push_function_frame_with_values(xvm, closure->function, 4, tmp);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
}

static inline void exec_tail_apply_4(xvm_t *xvm, frame_t *frame, value_t *locals) {
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
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("tail-apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t tmp[5];
  tmp[0] = target;
  tmp[1] = locals[a0];
  tmp[2] = locals[a1];
  tmp[3] = locals[a2];
  tmp[4] = locals[a3];
  xvm_push_root(xvm, tmp[0]);
  xvm_push_root(xvm, tmp[1]);
  xvm_push_root(xvm, tmp[2]);
  xvm_push_root(xvm, tmp[3]);
  xvm_push_root(xvm, tmp[4]);
  xvm_pop_frame(xvm);
  xvm_push_function_frame_with_values(xvm, closure->function, 5, tmp);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
}

static inline void exec_tail_apply_5(xvm_t *xvm, frame_t *frame, value_t *locals) {
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
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("tail-apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t tmp[6];
  tmp[0] = target;
  tmp[1] = locals[a0];
  tmp[2] = locals[a1];
  tmp[3] = locals[a2];
  tmp[4] = locals[a3];
  tmp[5] = locals[a4];
  xvm_push_root(xvm, tmp[0]);
  xvm_push_root(xvm, tmp[1]);
  xvm_push_root(xvm, tmp[2]);
  xvm_push_root(xvm, tmp[3]);
  xvm_push_root(xvm, tmp[4]);
  xvm_push_root(xvm, tmp[5]);
  xvm_pop_frame(xvm);
  xvm_push_function_frame_with_values(xvm, closure->function, 6, tmp);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
}

static inline void exec_tail_apply_6(xvm_t *xvm, frame_t *frame, value_t *locals) {
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
  value_t target = locals[target_reg];
  if (!is_closure(target)) {
    who_printf("tail-apply target is not a closure\n");
    exit(1);
  }
  closure_t *closure = to_closure(target);
  value_t tmp[7];
  tmp[0] = target;
  tmp[1] = locals[a0];
  tmp[2] = locals[a1];
  tmp[3] = locals[a2];
  tmp[4] = locals[a3];
  tmp[5] = locals[a4];
  tmp[6] = locals[a5];
  xvm_push_root(xvm, tmp[0]);
  xvm_push_root(xvm, tmp[1]);
  xvm_push_root(xvm, tmp[2]);
  xvm_push_root(xvm, tmp[3]);
  xvm_push_root(xvm, tmp[4]);
  xvm_push_root(xvm, tmp[5]);
  xvm_push_root(xvm, tmp[6]);
  xvm_pop_frame(xvm);
  xvm_push_function_frame_with_values(xvm, closure->function, 7, tmp);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
  xvm_drop_root(xvm);
}
