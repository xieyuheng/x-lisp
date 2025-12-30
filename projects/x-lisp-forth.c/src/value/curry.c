#include "index.h"

const object_class_t curry_class = {
    .name = "curry",
    .equal_fn = (object_equal_fn_t *) curry_equal,
    .print_fn = (object_print_fn_t *) curry_print,
    .free_fn = (free_fn_t *) curry_free,
    .make_child_iter_fn = (object_make_child_iter_fn_t *) make_curry_child_iter,
    .child_iter_next_fn = (object_child_iter_next_fn_t *) curry_child_iter_next,
    .child_iter_free_fn = (free_fn_t *) curry_child_iter_free,
};

curry_t *
make_curry(value_t target, size_t arity, size_t size) {
    curry_t *self = new(curry_t);
    self->header.class = &curry_class;
    self->target = target;
    self->arity = arity;
    self->size = size;
    self->args = allocate_pointers(size);
    gc_add_object(global_gc, (object_t *) self);
    return self;
}

void
curry_free(curry_t *self) {
    free(self->args);
    free(self);
}

bool
curry_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &curry_class;
}

curry_t *
to_curry(value_t value) {
    assert(curry_p(value));
    return (curry_t *) to_object(value);
}

bool
curry_equal(const curry_t *lhs, const curry_t *rhs) {
    if (!equal_p(lhs->target, rhs->target)) return false;
    if (lhs->arity != rhs->arity) return false;
    if (lhs->size != rhs->size) return false;
    if (lhs->args == rhs->args) return true;

    for (size_t i = 0; i < lhs->size; i++) {
        if (!equal_p(lhs->args[i], rhs->args[i])) return false;
    }

    return true;
}

void
curry_print(const curry_t *self) {
    printf("(@curry ");
    value_print(self->target);
    printf(" %ld", self->arity);
    printf(" [");
    for (size_t i = 0; i < self->size; i++) {
        if (i > 0) printf(" ");
        value_print(self->args[i]);
    }
    printf("]");
    printf(")");
}

struct curry_child_iter_t {
    const curry_t *curry;
    bool target_consumed_p;
    size_t index;
};

curry_child_iter_t *
make_curry_child_iter(const curry_t *curry) {
    curry_child_iter_t *self = new(curry_child_iter_t);
    self->curry = curry;
    self->target_consumed_p = false;
    self->index = 0;
    return self;
}

void
curry_child_iter_free(curry_child_iter_t *self) {
    free(self);
}

object_t *
curry_child_iter_next(curry_child_iter_t *iter) {
    if (!iter->target_consumed_p) {
        iter->target_consumed_p = true;
        value_t value = iter->curry->target;
        return object_p(value)
            ? to_object(value)
            : curry_child_iter_next(iter);
    }

    if (iter->index < iter->curry->size) {
        value_t value = iter->curry->args[iter->index++];
        return object_p(value)
            ? to_object(value)
            : curry_child_iter_next(iter);
    }

    return NULL;
}
