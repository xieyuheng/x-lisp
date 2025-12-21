#pragma once

extern const object_class_t xstring_class;

struct xstring_t {
    struct object_header_t header;
    size_t length;
    char *string;
};

xstring_t *make_xstring(gc_t *gc, const char *string);
void xstring_free(xstring_t *self);

bool xstring_p(value_t value);
xstring_t *to_xstring(value_t value);

bool xstring_equal(xstring_t *lhs, xstring_t *rhs);
void xstring_print(xstring_t *self);
