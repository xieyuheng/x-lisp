#include "index.h"

frame_t *make_function_frame(const function_t *function,
                             uint8_t argc,
                             const uint16_t *args,
                             value_t *caller_locals) {
  frame_t *self = new(frame_t);
  self->kind = FUNCTION_FRAME;
  self->code = buffer_raw_bytes(function->buffer);
  self->pc = self->code;
  self->local_count = function->local_count;
  self->locals = allocate(sizeof(value_t) * self->local_count);
  if (args && caller_locals) {
    for (size_t i = 0; i < argc; i++) {
      self->locals[i] = caller_locals[args[i]];
    }
  }
  self->function_frame.function = function;
  return self;
}

frame_t *make_code_frame(uint8_t *code) {
  frame_t *self = new(frame_t);
  self->kind = CODE_FRAME;
  self->code = code;
  self->pc = self->code;
  self->local_count = 0;
  self->locals = NULL;
  return self;
}

frame_t *make_break_frame() {
  frame_t *self = new(frame_t);
  self->kind = BREAK_FRAME;
  self->local_count = 0;
  self->locals = NULL;
  return self;
}

void frame_free(frame_t *self) {
  free(self->locals);
  if (self->kind == CODE_FRAME) {
    free(self->code);
  }
  free(self);
}

inline value_t frame_get_local(frame_t *self, size_t index) {
  assert(index < self->local_count);
  return self->locals[index];
}

inline void frame_put_local(frame_t *self, size_t index, value_t value) {
  assert(index < self->local_count);
  self->locals[index] = value;
}
