#include "index.h"

void object_free(object_t *self) {
  const object_class_t *class = self->header.class;
  if (class->free_fn) {
    class->free_fn(self);
  }
}

void object_format(buffer_t *buffer, object_circle_ctx_t *ctx, object_t *self) {
  if (self == NULL) {
    format_template(buffer, "#(<null-object>)");
    return;
  }

  if (self->header.class == NULL) {
    format_template(buffer, "#(<classless> 0x%p)", (void *) self);
    return;
  }

  if (self->header.class->format_fn) {
    self->header.class->format_fn(buffer, ctx, self);
    return;
  }

  if (self->header.class->name) {
    format_template(buffer, "#(%s 0x%p)", self->header.class->name, (void *) self);
  } else {
    format_template(buffer, "#(<unnamed> 0x%p)", (void *) self);
  }
}

void object_print(object_circle_ctx_t *ctx, object_t *self) {
  buffer_t *buffer = make_buffer();
  object_format(buffer, ctx, self);
  buffer_write(buffer, stdout);
  buffer_free(buffer);
}
