#pragma once

struct gc_t {
    array_t *allocated_objects;
    stack_t *gray_object_stack;
};

gc_t *make_gc(void);
void gc_free(gc_t *self);
