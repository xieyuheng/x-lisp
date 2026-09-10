#include "index.h"

void object_free(object_t *self) {
  const object_class_t *class = self->header.class;
  if (class->free_fn) {
    class->free_fn(self);
  }
}

void write_object(buffer_t *buffer, object_circle_ctx_t *ctx, object_t *self) {
  if (self == NULL) {
    write_template(buffer, "#(<null-object>)");
    return;
  }

  if (self->header.class == NULL) {
    write_template(buffer, "#(<classless> 0x%p)", (void *) self);
    return;
  }

  if (self->header.class->write_fn) {
    self->header.class->write_fn(buffer, ctx, self);
    return;
  }

  if (self->header.class->name) {
    write_template(buffer, "#(%s 0x%p)", self->header.class->name, (void *) self);
  } else {
    write_template(buffer, "#(<unnamed> 0x%p)", (void *) self);
  }
}

void print_object(object_circle_ctx_t *ctx, object_t *self) {
  buffer_t *buffer = make_buffer();
  write_object(buffer, ctx, self);
  buffer_write(buffer, stdout);
  buffer_free(buffer);
}
