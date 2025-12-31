#include "index.h"

printer_t *
make_printer(void) {
    printer_t *self = new(printer_t);
    self->occurred_objects = make_set();
    self->circle_indexes = make_hash();
    return self;
}

void
printer_free(printer_t *self) {
    set_free(self->occurred_objects);
    hash_free(self->circle_indexes);
    free(self);
}

static void
printer_collect_circle(printer_t *self, object_t *object) {
    if (set_member(self->occurred_objects, object)) {
        if (hash_has(self->circle_indexes, object)) return;

        size_t index = hash_length(self->circle_indexes);
        hash_put(self->circle_indexes, object, (void *) index);
        return;
    }

    set_add(self->occurred_objects, object);

    const object_class_t *class = object->header.class;
    if (class->make_child_iter_fn) {
        void *iter = class->make_child_iter_fn(object);
        object_t *child = class->child_iter_next_fn(iter);
        while (child) {
            printer_collect_circle(self, child);
            child = class->child_iter_next_fn(iter);
        }

        class->child_iter_free_fn(iter);
    }
}

void
print(value_t value) {
    printer_t *printer = make_printer();
    if (object_p(value)) {
        printer_collect_circle(printer, to_object(value));
    }

    // value_print(printer, value);
    value_print(value);
    printer_free(printer);
}
