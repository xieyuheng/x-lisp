#pragma once

void format_template(buffer_t *buffer, const char *template, ...)
  __attribute__((format(printf, 2, 3)));

void format_int(buffer_t *buffer, int64_t n);
void format_uint(buffer_t *buffer, uint64_t n);
void format_char(buffer_t *self, char c);
void format_string(buffer_t *buffer, const char *string);
void format_substring(buffer_t *self, const char *string, size_t start, size_t end);
