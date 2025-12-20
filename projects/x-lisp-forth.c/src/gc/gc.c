#include "index.h"

gc_t *
make_gc(void) {
    gc_t *self = new(gc_t);
    self->allocated_objects = make_array_auto_with(free);
    self->gray_object_stack = make_stack();
    return self;
}

void
gc_free(gc_t *self) {
    array_free(self->allocated_objects);
    stack_free(self->gray_object_stack);
    free(self);
}
