#include "index.h"

typedef void *(fn_t)(void);

void *x86_execute(const buffer_t *buffer) {
  uint8_t *bytes = buffer_raw_bytes(buffer);
  size_t length = buffer_length(buffer);

  void *memory = mmap(
    NULL, length,
    PROT_READ | PROT_WRITE,
    MAP_PRIVATE | MAP_ANONYMOUS,
    -1, 0);
  if (memory == MAP_FAILED) {
    where_printf("[mmap]: %s\n", strerror(errno));
    exit(1);
  }

  memcpy(memory, bytes, length);
  if (mprotect(memory, length, PROT_READ | PROT_EXEC) == -1) {
    where_printf("[mprotect]: %s\n", strerror(errno));
    munmap(memory, length);
    exit(1);
  }

  fn_t *fn;
  memcpy(&fn, &memory, sizeof(fn));
  void *result = fn();
  munmap(memory, length);
  return result;
}
