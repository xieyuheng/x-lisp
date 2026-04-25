#include "index.h"

file_t *open_file_or_fail(const char *pathname, const char *mode) {
  file_t *file = fopen(pathname, mode);
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
  return fileno(file);
}

off_t file_size(file_t *file) {
  struct stat st;
  fstat(fileno(file), &st);
  return st.st_size;
}

char *file_read_string(file_t *file) {
  off_t size = file_size(file);
  char *string = allocate(size + 1); // +1 for the ending '\0'.
  size_t nbytes = fread(string, 1, size, file);
  assert(nbytes == (size_t) size);
  return string;
}

uint8_t *file_read_bytes(file_t *file) {
  off_t size = file_size(file);
  uint8_t *bytes = allocate(size);
  size_t nbytes = fread(bytes, 1, size, file);
  assert(nbytes == (size_t) size);
  return bytes;
}

void file_write_bytes(file_t *file, const uint8_t *bytes, size_t size) {
  fwrite(bytes, 1, size, file);
}

void file_write_string(file_t *file, const char *string) {
  file_write_bytes(file, (uint8_t *) string, string_length(string));
  fflush(file);
  fsync(fileno(file));
}

void file_lock(file_t *file) {
  flockfile(file);
}

void file_unlock(file_t *file) {
  funlockfile(file);
}
