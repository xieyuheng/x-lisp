#include "index.h"

struct gc_t {
    array_t *objects;
    stack_t *work_stack;
};

gc_t *
make_gc(void) {
    gc_t *self = new(gc_t);
    self->objects = make_array();
    self->work_stack = make_stack();
    return self;
}

void
gc_free(gc_t *self) {
    for (size_t i = 0; i < array_length(self->objects); i++) {
        object_t *object = array_get(self->objects, i);
        object_free(object);
    }

    array_free(self->objects);
    stack_free(self->work_stack);
    free(self);
}

inline size_t
gc_object_count(gc_t *self) {
    return array_length(self->objects);
}

inline void
gc_add_object(gc_t *self, object_t *object) {
    array_push(self->objects, object);
}

void
gc_mark_object(gc_t *self, object_t *object) {
    if (object->header.mark) return;

    object->header.mark = true;

    const object_class_t *class = object->header.class;
    if (class->make_child_iter_fn) {
        stack_push(self->work_stack, object);
    }
}

void
gc_mark(gc_t *self) {
    while (!stack_is_empty(self->work_stack)) {
        object_t *object = stack_pop(self->work_stack);
        const object_class_t *class = object->header.class;
        void *iter = class->make_child_iter_fn(object);
        object_t *child = class->child_iter_next_fn(iter);
        while (child) {
            gc_mark_object(self, child);
            child = class->child_iter_next_fn(iter);
        }

        class->child_iter_free_fn(iter);
    }
}

void
gc_sweep(gc_t *self) {
    array_t *reachable_objects = make_array();

    for (size_t i = 0; i < array_length(self->objects); i++) {
        object_t *object = array_get(self->objects, i);
        if (object->header.mark) {
            object->header.mark = false;
            array_push(reachable_objects, object);
        } else {
            object_free(object);
        }
    }

    array_free(self->objects);
    self->objects = reachable_objects;
}

void
gc_report(gc_t *self) {
    if (array_is_empty(self->objects)) {
        printf("objects: (empty)\n");
        return;
    }

    printf("objects:\n");
    for (size_t i = 0; i < array_length(self->objects); i++) {
        object_t *object = array_get(self->objects, i);
        printf("  %ld: ", i); object_print(object); printf("\n");
    }
}
