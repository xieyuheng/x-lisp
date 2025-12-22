#include "index.h"

tael_t *
make_tael(gc_t *gc) {
    tael_t *self = new(tael_t);
    self->header.class = &tael_class;
    self->elements = make_array_auto();
    self->attributes = make_record();
    gc_add_object(gc, (object_t *) self);
    return self;
}

const object_class_t tael_class = {
    .name = "tael",
    // .print_fn = (object_print_fn_t *) tael_print,
    // .equal_fn = (object_equal_fn_t *) tael_equal,
    // .free_fn = (free_fn_t *) tael_free,
    // .make_child_iter_fn = (object_make_child_iter_fn_t *) make_tael_child_iter,
    // .child_iter_free_fn = (free_fn_t *) tael_child_iter_free,
    // .first_child_fn = (object_child_fn_t *) tael_first_child,
    // .next_child_fn = (object_child_fn_t *) tael_next_child,
};
