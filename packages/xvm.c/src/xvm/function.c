#include "index.h"

function_t *make_function(const char *name, uint16_t arity, uint16_t local_count) {
  function_t *self = new(function_t);
  self->name = string_copy(name);
  self->arity = arity;
  self->local_count = local_count;
  self->code_length = 0;
  self->bytecode = NULL;
  self->threaded_code = NULL;
  self->threaded_code_length = 0;
  self->frame_size = frame_byte_size(local_count);
  self->threaded_ready = false;
  return self;
}

void function_free(function_t *self) {
  if (self == NULL) return;
  free(self->name);
  free(self->bytecode);
  free(self->threaded_code);
  free(self);
}
