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
gc_mark_object(gc_t *self, object_t *object) {
    if (object->header.mark) return;

    object->header.mark = true;

    const object_class_t *class = object->header.class;
    if (class->child_iter_fn) {
        stack_push(self->work_stack, object);
    }
}
// static void gc_unmark_object(gc_t *self, object_t *object);

void
gc_mark(gc_t *self) {
    while (!stack_is_empty(self->work_stack)) {
        object_t *object = stack_pop(self->work_stack);
        const object_class_t *class = object->header.class;
        void *iter = class->child_iter_fn(object);
        object_t *child = class->first_child_fn(iter);
        while (child) {
            gc_mark_object(self, child);
            child = class->next_child_fn(iter);
        }

        class->iter_free_fn(iter);
    }
}
