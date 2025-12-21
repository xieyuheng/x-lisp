#include "index.h"

const object_class_t xstring_class = {
    .name = "xstring",
    // .print_fn = (object_print_fn_t *) xstring_print,
    // .equal_fn = (object_equal_fn_t *) xstring_equal,
    .free_fn = (free_fn_t *) xstring_free,
};

xstring_t *
make_xstring(gc_t *gc, const char *string) {
    xstring_t *self = new(xstring_t);
    self->header.class = &xstring_class;
    self->length = string_length(string);
    self->string = string_copy(string);
    gc_add_object(gc, (object_t *) self);
    return self;
}

void
xstring_free(xstring_t *self) {
    string_free(self->string);
    free(self);
}
