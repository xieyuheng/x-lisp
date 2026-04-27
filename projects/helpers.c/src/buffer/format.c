#include "index.h"

void format_template(buffer_t *buffer, const char *template, ...) {
  va_list args;
  va_start(args, template);

  va_list args_copy;
  va_copy(args_copy, args);
  int expected_length = vsnprintf(NULL, 0, template, args_copy);
  assert(expected_length != -1);
  va_end(args_copy);

  size_t length = buffer_length(buffer);
  buffer_ensure_capacity(buffer, length + expected_length + 1);
  buffer_seek(buffer, length + expected_length);

  char *string = (char *) buffer_raw_bytes(buffer) + length;
  int written = vsnprintf(string, expected_length + 1, template, args);
  assert(written != -1);
  va_end(args);
}

void format_int(buffer_t *buffer, int64_t n) {
  format_template(buffer, "%" PRId64, n);
}

void format_uint(buffer_t *buffer, uint64_t n) {
  format_template(buffer, "%" PRIu64, n);
}

void format_char(buffer_t *self, char c) {
  buffer_put_byte(self, buffer_length(self), c);
}

void format_string(buffer_t *self, const char *string) {
  for (size_t i = 0; i < string_length(string); i++) {
    format_char(self, string[i]);
  }
}

void format_substring(buffer_t *self, const char *string, size_t start, size_t end) {
  for (size_t i = start; i < end; i++) {
    format_char(self, string[i]);
  }
}
