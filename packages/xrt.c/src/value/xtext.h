#pragma once

extern const object_class_t xtext_class;

xtext_t *make_static_xtext(const char *string);
xtext_t *make_xtext_take_text(text_t *text);
xtext_t *make_xtext_take(char *string);
xtext_t *make_xtext(const char *string);
void xtext_free(xtext_t *self);

bool is_xtext(value_t value);
xtext_t *to_xtext(value_t value);

bool xtext_equal(const xtext_t *lhs, const xtext_t *rhs);
void xtext_format(buffer_t *buffer, object_circle_ctx_t *ctx, const xtext_t *self);
hash_code_t xtext_hash_code(const xtext_t *self);
ordering_t xtext_compare(const xtext_t *lhs, const xtext_t *rhs);


const text_t *xtext_text(const xtext_t *self);
const char *xtext_string(const xtext_t *self);
size_t xtext_length(const xtext_t *self);
bool xtext_is_empty(const xtext_t *self);

xtext_t *xtext_append(xtext_t *left, xtext_t *right);
