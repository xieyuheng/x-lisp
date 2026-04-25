#pragma once

file_t *open_file_or_fail(const char *pathname, const char *mode);
void file_close(file_t *file);
int file_raw_fd(file_t *file);
off_t file_size(file_t *file);

char *file_read_string(file_t *file);

uint8_t *file_read_bytes(file_t *file);
void file_write_bytes(file_t *file, const uint8_t *bytes, size_t size);
void file_write_string(file_t *file, const char *string);

buffer_t *file_read_buffer(file_t *file);
void file_write_buffer(file_t *file, const buffer_t *buffer);

void file_lock(file_t *file);
void file_unlock(file_t *file);
