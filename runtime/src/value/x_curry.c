#include "index.h"

object_spec_t curry_object_spec = {
    .name = "curry",
    .print_fn = (object_print_fn_t *) NULL,
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

void
curry_put(curry_t *self, size_t index, value_t value) {
    self->args[index] = value;
}

bool
curry_p(value_t value) {
    object_t *object = to_object(value);
    return object->spec == &curry_object_spec;
}

curry_t *
to_curry(value_t value) {
    object_t *object = to_object(value);
    assert(curry_p(object));
    return (curry_t *) object;
}

value_t
x_make_curry(value_t target, value_t arity, value_t size) {
    curry_t *curry = make_curry(target, to_int64(arity), to_int64(size));
    return x_object((object_t *) curry);
}

value_t
x_curry_put_mut(value_t index, value_t value, value_t curry) {
    to_curry(curry)->args[to_int64(index)] = value;
    return x_void;
}
