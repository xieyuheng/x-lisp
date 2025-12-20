#include "index.h"

gc_t *
make_gc(void) {
    gc_t *self = new(gc_t);
    self->allocated_objects = make_array_auto_with(free);
    self->gray_object_stack = make_stack();
    return self;
}
