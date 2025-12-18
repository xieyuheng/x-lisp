#pragma once

extern const char *curry_object_name;

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

bool curry_equal(curry_t *lhs, curry_t *rhs);
void curry_print(curry_t *self);
