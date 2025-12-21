#pragma once

extern const object_class_t xstring_class;

struct xstring_t {
    struct object_header_t header;
    size_t length;
    char *string;
};

xstring_t *make_xstring(gc_t *gc, const char *string);
void xstring_free(xstring_t *self);
