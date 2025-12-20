#include "index.h"

struct gc_t {
    array_t *allocated_objects;
    stack_t *work_stack;
};

gc_t *
make_gc(void) {
    gc_t *self = new(gc_t);
    self->allocated_objects = make_array_auto_with(free);
    self->work_stack = make_stack();
    return self;
}

void
gc_free(gc_t *self) {
    array_free(self->allocated_objects);
    stack_free(self->work_stack);
    free(self);
}

void
gc_add_root(gc_t *self, object_t *root) {
    stack_push(self->work_stack, root);
}

// gc_mark_object
// gc_unmark_object
