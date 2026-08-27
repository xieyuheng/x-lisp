#include "index.h"

function_t *make_function(const char *name) {
  function_t *self = new(function_t);
  self->name = name;
  self->local_count = 0;
  self->arity = 0;
  self->buffer = make_buffer();
  return self;
}

void function_free(function_t *self) {
  buffer_free(self->buffer);
  free(self);
}