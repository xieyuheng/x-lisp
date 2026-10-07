#include "index.h"

file_t *open_file_or_fail(const char *pathname, const char *mode) {
  file_t *file = os_fopen(pathname, mode);
  if (!file) {
    who_printf("file name: %s\n", pathname);
    who_printf("mode: %s\n", mode);
    exit(1);
  }

  setbuf(file, NULL);
  return file;
}

void file_close(file_t *file) {
  assert(fclose(file) == 0);
}

int file_raw_fd(file_t *file) {
  return os_file_descriptor(file);
}

int64_t file_size(file_t *file) {
  int64_t size = os_file_size(file);
  assert(size >= 0);
  return size;
}

char *file_read_string(file_t *file) {
  int64_t size = file_size(file);
  char *string = allocate((size_t) size + 1); // +1 for the ending '\0'.
  size_t nbytes = fread(string, 1, (size_t) size, file);
  assert(nbytes == (size_t) size);
  return string;
}

uint8_t *file_read_bytes(file_t *file) {
  int64_t size = file_size(file);
  uint8_t *bytes = allocate((size_t) size);
  size_t nbytes = fread(bytes, 1, (size_t) size, file);
  assert(nbytes == (size_t) size);
  return bytes;
}

void file_write_bytes(file_t *file, const uint8_t *bytes, size_t size) {
  size_t offset = 0;
  while (offset < size) {
    size_t written = fwrite(bytes + offset, 1, size - offset, file);
    if (written == 0) break;
    offset += written;
  }

  if (offset != size) {
    if (file == stdout || file == stderr) {
      clearerr(file);
      return;
    }
    assert(offset == size);
  }
}

void file_write_string(file_t *file, const char *string) {
  file_write_bytes(file, (uint8_t *) string, string_length(string));
  fflush(file);
  assert(os_file_sync(file));
}

void file_lock(file_t *file) {
  os_file_lock(file);
}

void file_unlock(file_t *file) {
  os_file_unlock(file);
}
