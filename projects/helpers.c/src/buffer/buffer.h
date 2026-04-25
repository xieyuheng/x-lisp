#pragma once

buffer_t *make_buffer(size_t capacity);
void buffer_free(buffer_t *self);

size_t buffer_capacity(const buffer_t *self);
size_t buffer_length(const buffer_t *self);
uint8_t *buffer_raw_bytes(const buffer_t *self);

buffer_t *buffer_copy(const buffer_t *self);
bool buffer_equal(const buffer_t *left, const buffer_t *right);

bool buffer_is_full_capacity(const buffer_t *self);
void buffer_double_capacity(buffer_t *self);
