#pragma once

extern const object_class_t xstring_class;

struct xstring_t {
    struct object_header_t header;
    size_t length;
    char *string;
};

xstring_t *make_xstring(char *string);
xstring_t *make_xstring_no_gc(char *string);
void xstring_free(xstring_t *self);

bool xstring_p(value_t value);
xstring_t *to_xstring(value_t value);

bool xstring_equal(const xstring_t *lhs, const xstring_t *rhs);
void xstring_print(const xstring_t *self);
uint64_t xstring_hash_code(const xstring_t *self);
ordering_t xstring_compare(const xstring_t *lhs, const xstring_t *rhs);

size_t xstring_length(const xstring_t *self);
bool xstring_is_empty(const xstring_t *self);

xstring_t *xstring_append(xstring_t *left, xstring_t *right);
