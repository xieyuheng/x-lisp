#include "index.h"

frame_t *make_function_frame(const function_t *function,
                             uint8_t argc,
                             const uint16_t *args,
                             value_t *caller_locals) {
  frame_t *self = new(frame_t);
  self->function = function;
  self->pc = buffer_raw_bytes(function->buffer);
  self->local_count = function->local_count;
  self->locals = allocate(sizeof(value_t) * self->local_count);
  if (args && caller_locals) {
    for (size_t i = 0; i < argc; i++) {
      self->locals[i] = caller_locals[args[i]];
    }
  }
  return self;
}

frame_t *make_function_frame_with_values(const function_t *function,
                                          size_t argc,
                                          value_t *values) {
  frame_t *self = new(frame_t);
  self->function = function;
  self->pc = buffer_raw_bytes(function->buffer);
  self->local_count = function->local_count;
  self->locals = allocate(sizeof(value_t) * self->local_count);
  for (size_t i = 0; i < argc && i < function->local_count; i++) {
    self->locals[i] = values[i];
  }
  return self;
}

void frame_free(frame_t *self) {
  free(self->locals);
  free(self);
}

void frame_iter_init(frame_iter_t *self, const xvm_t *xvm) {
  self->xvm = xvm;
  self->count = stack_length(xvm->frame_stack);
  self->index = self->count;
}

frame_t *frame_iter_next(frame_iter_t *self) {
  if (self->index == 0) return NULL;
  self->index--;
  return stack_get(self->xvm->frame_stack, self->index);
}
