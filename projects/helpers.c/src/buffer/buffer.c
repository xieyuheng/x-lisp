#include "index.h"

// with an extra ending '\0' to be viewed as string.

struct buffer_t {
  size_t capacity;
  size_t cursor;
  uint8_t *bytes;
};

buffer_t *make_buffer(size_t capacity) {
  buffer_t *self = new(buffer_t);
  self->capacity = capacity;
  self->cursor = 0;
  self->bytes = allocate(capacity + 1);
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
