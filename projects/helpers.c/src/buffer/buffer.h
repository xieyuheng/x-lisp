#pragma once

buffer_t *make_buffer(void);
buffer_t *make_zero_buffer(size_t length);
void buffer_free(buffer_t *self);

size_t buffer_capacity(const buffer_t *self);
size_t buffer_length(const buffer_t *self);
void buffer_seek(buffer_t *self, size_t cursor);
void buffer_clear(buffer_t *self);
uint8_t *buffer_raw_bytes(const buffer_t *self);

buffer_t *buffer_copy(const buffer_t *self);
bool buffer_equal(const buffer_t *left, const buffer_t *right);

bool buffer_is_full_capacity(const buffer_t *self);
void buffer_double_capacity(buffer_t *self);
void buffer_ensure_capacity(buffer_t *self, size_t length);

uint8_t buffer_get_byte(const buffer_t *self, size_t index);
void buffer_put_byte(buffer_t *self, size_t index, uint8_t byte);

void buffer_append_byte(buffer_t *self, uint8_t byte);
void buffer_append_bytes(buffer_t *self, const uint8_t *bytes, size_t count);
void buffer_append_char(buffer_t *self, char c);
void buffer_append_string(buffer_t *self, const char *string);
void buffer_append_substring(buffer_t *self, const char *string, size_t start, size_t end);

char *buffer_to_string(const buffer_t *self);

void buffer_printf(buffer_t *self, const char *fmt, ...)
  __attribute__((format(printf, 2, 3)));

void buffer_write_file(const buffer_t *self, file_t *file);
