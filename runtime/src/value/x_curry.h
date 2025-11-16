#pragma once

extern object_spec_t curry_object_spec;

struct curry_t {
    object_spec_t *spec;
    value_t target;
    size_t arity;
    size_t size;
    value_t *args;
};

curry_t *make_curry(value_t target, size_t arity, size_t size);
void curry_free(curry_t *self);

void curry_put(curry_t *self, size_t index, value_t value);

value_t x_make_curry(value_t target, value_t arity, value_t size);
value_t x_curry_put_mut(value_t index, value_t value, value_t curry);
