#include "index.h"

// with an extra ending '\0' to be viewed as string.

struct buffer_t {
  size_t size;
  uint8_t *bytes;
};

buffer_t *make_buffer(size_t size) {
  buffer_t *self = new(buffer_t);
  self->size = size;
  self->bytes = allocate(size + 1);
  return self;
}

void buffer_free(buffer_t *self) {
  free(self->bytes);
  free(self);
}

size_t buffer_size(const buffer_t *self) {
  return self->size;
}

uint8_t *buffer_bytes(const buffer_t *self) {
  return self->bytes;
}

const char *buffer_string(const buffer_t *self) {
  return (char *) self->bytes;
}

void buffer_copy_from(buffer_t *self, const uint8_t *bytes) {
  memcpy(self->bytes, bytes, self->size);
}

void buffer_copy_into(const buffer_t *self, uint8_t *bytes) {
  memcpy(bytes, self->bytes, self->size);
}

bool buffer_equal(const buffer_t *left, const buffer_t *right) {
  if (left == right)
    return true;

  if (left->size != right->size)
    return false;

  return memcmp(left->bytes, right->bytes, left->size) == 0;
}

buffer_t *buffer_copy(const buffer_t *self) {
  buffer_t *buffer = make_buffer(self->size);
  memcpy(buffer->bytes, self->bytes, self->size);
  return buffer;
}
