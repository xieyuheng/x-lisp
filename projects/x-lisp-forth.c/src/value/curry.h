#pragma once

extern const object_class_t curry_class;

struct curry_t {
    struct object_header_t header;
    value_t target;
    size_t arity;
    size_t size;
    value_t *args;
};

curry_t *make_curry(value_t target, size_t arity, size_t size);
void curry_free(curry_t *self);

bool curry_p(value_t value);
curry_t *to_curry(value_t value);

bool curry_equal(const curry_t *lhs, const curry_t *rhs);
void curry_print(const curry_t *self);
