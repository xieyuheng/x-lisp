#include "index.h"

void
object_free(object_t *self) {
    const object_class_t *class = self->header.class;
    if (class->free_fn) {
        class->free_fn(self);
    }
}
