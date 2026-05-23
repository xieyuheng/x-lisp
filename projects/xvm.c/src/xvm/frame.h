#pragma once

typedef enum {
  FUNCTION_FRAME,
  CODE_FRAME,
  BREAK_FRAME,
} frame_kind_t;

struct frame_t {
  frame_kind_t kind;
  uint8_t *code;
  uint8_t *pc;
  uint16_t local_count;
  value_t *locals;
  union {
    struct { const function_t *function; } function_frame;
  };
};

frame_t *make_function_frame(const function_t *function,
                             uint8_t argc,
                             const uint16_t *args,
                             value_t *caller_locals);
frame_t *make_code_frame(uint8_t *code);
frame_t *make_break_frame();
void frame_free(frame_t *self);

value_t frame_get_local(frame_t *self, size_t index);
void frame_put_local(frame_t *self, size_t index, value_t value);
