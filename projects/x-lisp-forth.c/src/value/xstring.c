#include "index.h"

const object_class_t xstring_class = {
    .name = "xstring",
    .print_fn = (object_print_fn_t *) xstring_print,
    .equal_fn = (object_equal_fn_t *) xstring_equal,
    .free_fn = (free_fn_t *) xstring_free,
};

xstring_t *
make_xstring(char *string) {
    xstring_t *self = new(xstring_t);
    self->header.class = &xstring_class;
    self->length = string_length(string);
    self->string = string;
    gc_add_object(global_gc, (object_t *) self);
    return self;
}

void
xstring_free(xstring_t *self) {
    string_free(self->string);
    free(self);
}

bool
xstring_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &xstring_class;
}

xstring_t *
to_xstring(value_t value) {
    assert(xstring_p(value));
    return (xstring_t *) to_object(value);
}

bool
xstring_equal(xstring_t *lhs, xstring_t *rhs) {
    return lhs->length == rhs->length
        && string_equal(lhs->string, rhs->string);
}

void
xstring_print(xstring_t *self) {
    printf("%s", self->string);
}

size_t
xstring_length(xstring_t *self) {
    return self->length;
}

bool
xstring_is_empty(xstring_t *self) {
    return self->length == 0;
}

xstring_t *
xstring_append(xstring_t *left, xstring_t *right) {
    return make_xstring(string_append(left->string, right->string));
}
