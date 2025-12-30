#include "index.h"

xhash_t *
make_xhash(void) {
    xhash_t *self = new(xhash_t);
    self->header.class = &xhash_class;
    self->hash = make_hash();
    gc_add_object(global_gc, (object_t *) self);
    return self;
}

void
xhash_free(xhash_t *self) {
    hash_free(self->hash);
    free(self);
}

bool
xhash_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &xhash_class;
}

xhash_t *
to_xhash(value_t value) {
    assert(xhash_p(value));
    return (xhash_t *) to_object(value);
}

// bool
// xhash_equal(const xhash_t *lhs, const xhash_t *rhs) {
//     if (hash_length(lhs->hash) != hash_length(rhs->hash))
//         return false;

//     hash_iter_t iter;
//     hash_iter_init(&iter, lhs->hash);
//     const char *key = hash_iter_next_key(&iter);
//     while (key) {
//         value_t left = xhash_get(lhs, key);
//         value_t right = xhash_get(rhs, key);
//         if (!equal_p(left, right))
//             return false;

//         key = hash_iter_next_key(&iter);
//     }

//     return true;
// }

const object_class_t xhash_class = {
    .name = "hash",
    // .equal_fn = (object_equal_fn_t *) xhash_equal,
    // .print_fn = (object_print_fn_t *) xhash_print,
    // .hash_code_fn = (object_hash_code_fn_t *) xhash_hash_code,
    .free_fn = (free_fn_t *) xhash_free,
    // .make_child_iter_fn = (object_make_child_iter_fn_t *) make_xhash_child_iter,
    // .child_iter_next_fn = (object_child_iter_next_fn_t *) xhash_child_iter_next,
    // .child_iter_free_fn = (free_fn_t *) xhash_child_iter_free,
};
