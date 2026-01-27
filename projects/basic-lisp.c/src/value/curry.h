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
void curry_print(printer_t *printer, const curry_t *self);

curry_child_iter_t *make_curry_child_iter(const curry_t *curry);
void curry_child_iter_free(curry_child_iter_t *self);
object_t *curry_child_iter_next(curry_child_iter_t *iter);
