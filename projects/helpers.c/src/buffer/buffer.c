#include "index.h"

struct buffer_t {
  size_t capacity;
  uint8_t *bytes;
  size_t cursor;
};

buffer_t *make_buffer(size_t capacity) {
  buffer_t *self = new(buffer_t);
  self->capacity = capacity;
  self->bytes = allocate(capacity);
  self->cursor = 0;
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

uint8_t *buffer_raw_bytes(const buffer_t *self) {
  return self->bytes;
}

buffer_t *buffer_copy(const buffer_t *self) {
  buffer_t *buffer = make_buffer(self->capacity);
  memcpy(buffer->bytes, self->bytes, self->capacity);
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

uint8_t buffer_get_byte(const buffer_t *self, size_t index) {
  assert(index < buffer_length(self));
  return self->bytes[index];
}
