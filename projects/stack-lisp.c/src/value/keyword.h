#pragma once

extern const object_class_t keyword_class;

keyword_t *intern_keyword(const char *string);
void keyword_free(keyword_t *self);

const char *keyword_string(const keyword_t *self);
size_t keyword_length(const keyword_t *self);

bool keyword_p(value_t value);
keyword_t *to_keyword(value_t value);

void keyword_print(object_circle_ctx_t *ctx, const keyword_t *self);
hash_code_t keyword_hash_code(const keyword_t *self);
ordering_t keyword_compare(const keyword_t *lhs, const keyword_t *rhs);
