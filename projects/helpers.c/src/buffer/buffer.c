#include "index.h"

struct buffer_t {
  size_t capacity;
  uint8_t *bytes;
  size_t cursor;
};

buffer_t *make_buffer(void) {
  size_t capacity = 265;
  buffer_t *self = new(buffer_t);
  self->capacity = capacity;
  self->bytes = allocate(capacity);
  self->cursor = 0;
  return self;
}

buffer_t *
make_zero_buffer(size_t length) {
  size_t capacity = uint_align_to_power_of_two(length);
  buffer_t *self = new(buffer_t);
  self->capacity = capacity;
  self->bytes = allocate(capacity);
  self->cursor = length;
  return self;
}

void buffer_free(buffer_t *self) {
  free(self->bytes);
  free(self);
}

size_t buffer_capacity(const buffer_t *self) {
  return self->capacity;
}

size_t buffer_length(const buffer_t *self) {
  return self->cursor;
}

void buffer_seek(buffer_t *self, size_t cursor) {
  buffer_ensure_capacity(self, cursor);
  self->cursor = cursor;
}

void buffer_clear(buffer_t *self) {
  buffer_seek(self, 0);
}

uint8_t *buffer_raw_bytes(const buffer_t *self) {
  return self->bytes;
}

buffer_t *buffer_copy(const buffer_t *self) {
  buffer_t *buffer = make_zero_buffer(buffer_length(self));
  memcpy(buffer->bytes, self->bytes, buffer_length(self));
  return buffer;
}

bool buffer_equal(const buffer_t *left, const buffer_t *right) {
  if (left == right) return true;
  if (buffer_length(left) != buffer_length(right)) return false;
  return memcmp(left->bytes, right->bytes, buffer_length(left)) == 0;
}

bool buffer_is_full_capacity(const buffer_t *self) {
  return buffer_length(self) == self->capacity;
}

void buffer_double_capacity(buffer_t *self) {
  void *bytes = allocate(self->capacity * 2);
  memcpy(self->bytes, bytes, buffer_length(self));
  free(self->bytes);
  self->bytes = bytes;
  self->capacity *= 2;
}

void buffer_ensure_capacity(buffer_t *self, size_t capacity) {
  if (capacity > self->capacity) {
    buffer_double_capacity(self);
    buffer_ensure_capacity(self, capacity);
  }
}

uint8_t buffer_get_byte(const buffer_t *self, size_t index) {
  assert(index < buffer_length(self));
  return self->bytes[index];
}

void buffer_put_byte(buffer_t *self, size_t index, uint8_t byte) {
  buffer_ensure_capacity(self, index + 1);

  if (index + 1 > self->cursor) {
    self->cursor = index + 1;
  }

  self->bytes[index] = byte;
}

void buffer_append_char(buffer_t *self, char c) {
  buffer_put_byte(self, buffer_length(self), c);
}

void buffer_append_string(buffer_t *self, const char *string) {
  for (size_t i = 0; i < string_length(string); i++) {
    buffer_append_char(self, string[i]);
  }
}

void buffer_append_substring(buffer_t *self, const char *string, size_t start, size_t end) {
  for (size_t i = start; i < end; i++) {
    buffer_append_char(self, string[i]);
  }
}

char *buffer_to_string(const buffer_t *self) {
  return string_substring((char *) self->bytes, 0, self->cursor);
}

void buffer_printf(buffer_t *self, const char *fmt, ...) {
  va_list args;
  va_start(args, fmt);

  va_list args_copy;
  va_copy(args_copy, args);
  int expected_length = vsnprintf(NULL, 0, fmt, args_copy);
  assert(expected_length != -1);
  va_end(args_copy);

  size_t length = buffer_length(self);
  buffer_ensure_capacity(self, length + expected_length + 1);
  self->cursor += expected_length;

  char *string = (char *) buffer_raw_bytes(self) + length;
  int written = vsnprintf(string, expected_length + 1, fmt, args);
  assert(written != -1);
  va_end(args);
}
