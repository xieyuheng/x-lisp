#pragma once

void write_template(buffer_t *buffer, const char *template, ...)
  __attribute__((format(printf, 2, 3)));

void write_int(buffer_t *buffer, int64_t n);
void write_uint(buffer_t *buffer, uint64_t n);
void write_char(buffer_t *self, char c);
void write_newline(buffer_t *self);
void write_string(buffer_t *buffer, const char *string);
void write_substring(buffer_t *self, const char *string, size_t start, size_t end);
