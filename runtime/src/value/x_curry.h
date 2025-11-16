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
