#include "index.h"

object_spec_t curry_object_spec = {
    .name = "curry",
    .print_fn = (print_fn_t *) NULL,
};

curry_t *
make_curry(value_t target, size_t arity, size_t size) {
    curry_t *self = new(curry_t);
    self->spec = &curry_object_spec;
    self->target = target;
    self->arity = arity;
    self->size = size;
    self->args = allocate_pointers(size);
    return self;
}

void
curry_free(curry_t *self) {
    free(self->args);
    free(self);
}
