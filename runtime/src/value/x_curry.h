#pragma once

extern object_spec_t curry_object_spec;

struct curry_t {
    object_spec_t *spec;
    value_t target;
    size_t arity;
    value_t *values;
};
