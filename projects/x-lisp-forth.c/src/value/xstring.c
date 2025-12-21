#include "index.h"

const object_class_t xstring_class = {
    .name = "xstring",
    // .print_fn = (object_print_fn_t *) xstring_print,
    // .equal_fn = (object_equal_fn_t *) xstring_equal,
};

xstring_t *
make_xstring(const char *string) {
    xstring_t *self = new(xstring_t);
    self->length = string_length(string);
    self->string = string_copy(string);
    return self;
}

// void xstring_free(xstring_t *self);
