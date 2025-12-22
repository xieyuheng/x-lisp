#include "index.h"

tael_t *
make_tael(gc_t *gc) {
    tael_t *self = new(tael_t);
    self->header.class = &tael_class;
    self->elements = make_array();
    self->attributes = make_record();
    gc_add_object(gc, (object_t *) self);
    return self;
}

void
tael_free(tael_t *self) {
    array_free(self->elements);
    record_free(self->attributes);
    free(self);
}

bool
tael_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &tael_class;
}

tael_t *
to_tael(value_t value) {
    assert(tael_p(value));
    return (tael_t *) to_object(value);
}

bool
tael_equal(tael_t *lhs, tael_t *rhs) {
    if (array_length(lhs->elements) != array_length(rhs->elements))
        return false;

    for (size_t i = 0; i < array_length(lhs->elements); i++) {
        value_t left = array_get(lhs->elements, i);
        value_t right = array_get(rhs->elements, i);
        if (!equal_p(left, right))
            return false;
    }

    if (record_length(lhs->attributes) != record_length(rhs->attributes))
        return false;

    const char *key = record_first_key(lhs->attributes);
    while (key) {
        value_t left = record_get(lhs->attributes, key);
        value_t right = record_get(rhs->attributes, key);
        if (!equal_p(left, right))
            return false;

        key = record_next_key(lhs->attributes);
    }

    return true;
}

const object_class_t tael_class = {
    .name = "tael",
    // .print_fn = (object_print_fn_t *) tael_print,
    // .equal_fn = (object_equal_fn_t *) tael_equal,
    .free_fn = (free_fn_t *) tael_free,
    // .make_child_iter_fn = (object_make_child_iter_fn_t *) make_tael_child_iter,
    // .child_iter_free_fn = (free_fn_t *) tael_child_iter_free,
    // .first_child_fn = (object_child_fn_t *) tael_first_child,
    // .next_child_fn = (object_child_fn_t *) tael_next_child,
};
