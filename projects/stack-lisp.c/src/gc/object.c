#include "index.h"

void object_free(object_t *self) {
  const object_class_t *class = self->header.class;
  if (class->free_fn) {
    class->free_fn(self);
  }
}

void object_format(buffer_t *buffer, object_circle_ctx_t *ctx, object_t *self) {
  if (self->header.class->format_fn) {
    self->header.class->format_fn(buffer, ctx, self);
    return;
  }

  buffer_printf(buffer, "#(%s 0x%p)", self->header.class->name, (void *) self);
  return;
}

void object_print(object_circle_ctx_t *ctx, object_t *self) {
  buffer_t *buffer = make_buffer();
  object_format(buffer, ctx, self);
  buffer_write(buffer, stdout);
  buffer_free(buffer);
}
