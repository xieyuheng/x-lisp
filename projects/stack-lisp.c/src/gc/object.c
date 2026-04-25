#include "index.h"

void object_free(object_t *self) {
  const object_class_t *class = self->header.class;
  if (class->free_fn) {
    class->free_fn(self);
  }
}

void object_print(object_circle_ctx_t *ctx, object_t *self) {
  if (self->header.class->print_fn) {
    self->header.class->print_fn(ctx, self);
    return;
  }

  printf("#(%s 0x%p)", self->header.class->name, (void *) self);
  return;
}
