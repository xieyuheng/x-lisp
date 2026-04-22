#pragma once

text_t *make_text_take(char *string);
text_t *make_text(const char *string);
void text_free(text_t *self);

size_t text_length(const text_t *self);
char *text_string(text_t *self);

code_point_t text_get_code_point(const text_t *self, size_t index);
bool text_equal(const text_t *left, const text_t *right);
text_t *text_copy(const text_t *self);
text_t *text_append(text_t *left, text_t *right);
text_t *text_subtext(text_t *self, size_t start, size_t end);
