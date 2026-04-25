#pragma once

buffer_t *make_buffer(size_t size);
void buffer_free(buffer_t *self);

size_t buffer_size(const buffer_t *self);
uint8_t *buffer_bytes(const buffer_t *self);
const char *buffer_string(const buffer_t *self);

void buffer_copy_from(buffer_t *self, const uint8_t *bytes);
void buffer_copy_into(const buffer_t *self, uint8_t *bytes);

bool buffer_equal(const buffer_t *left, const buffer_t *right);
buffer_t *buffer_copy(const buffer_t *self);
