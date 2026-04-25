#pragma once

string_builder_t *make_string_builder(void);
void string_builder_free(string_builder_t *self);

void string_builder_append_char(string_builder_t *self, char c);
void string_builder_append_string(string_builder_t *self, const char *string);
void string_builder_append_substring(string_builder_t *self, const char *string, size_t start, size_t end);

char *string_builder_produce(string_builder_t *self);
