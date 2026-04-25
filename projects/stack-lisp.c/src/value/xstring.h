#pragma once

extern const object_class_t xstring_class;

xstring_t *make_static_xstring(const char *string);
xstring_t *make_xstring_take_text(text_t *text);
xstring_t *make_xstring_take(char *string);
xstring_t *make_xstring(const char *string);
void xstring_free(xstring_t *self);

bool xstring_p(value_t value);
xstring_t *to_xstring(value_t value);

bool xstring_equal(const xstring_t *lhs, const xstring_t *rhs);
void xstring_print(object_circle_ctx_t *ctx, const xstring_t *self);
hash_code_t xstring_hash_code(const xstring_t *self);
ordering_t xstring_compare(const xstring_t *lhs, const xstring_t *rhs);


const text_t *xstring_text(const xstring_t *self);
const char *xstring_string(const xstring_t *self);
size_t xstring_length(const xstring_t *self);
bool xstring_is_empty(const xstring_t *self);

xstring_t *xstring_append(xstring_t *left, xstring_t *right);
