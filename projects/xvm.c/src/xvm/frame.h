#pragma once

struct frame_t {
  const function_t *function;
  uint8_t *pc;
  uint16_t local_count;
  value_t *locals;
};

frame_t *make_function_frame(const function_t *function,
                             uint8_t argc,
                             const uint16_t *args,
                             value_t *caller_locals);
frame_t *make_function_frame_with_values(const function_t *function,
                                          size_t argc,
                                          value_t *values);
void frame_free(frame_t *self);

typedef struct frame_iter_t {
  const xvm_t *xvm;
  size_t index;
  size_t count;
} frame_iter_t;

void frame_iter_init(frame_iter_t *self, const xvm_t *xvm);
frame_t *frame_iter_next(frame_iter_t *self);
