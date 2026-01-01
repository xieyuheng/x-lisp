#pragma once

bool pathname_exists(const char *pathname);
bool pathname_is_file(const char *pathname);
bool pathname_is_directory(const char *pathname);

file_t *open_file_or_fail(const char *pathname, const char *mode);
off_t file_size(file_t *file);

char *file_read_string(file_t *file);

uint8_t *file_read_bytes(file_t *file);
void file_write_bytes(file_t *file, uint8_t *bytes, size_t size);

blob_t *file_read_blob(file_t *file);
void file_write_blob(file_t *file, blob_t *blob);

void file_lock(file_t *file);
void file_unlock(file_t *file);

void file_disable_buffer(file_t *file);
