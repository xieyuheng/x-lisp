#include <stdint.h>

static long syscall3(long number, long a1, long a2, long a3) {
  long result;
  __asm__ volatile(
    "syscall"
    : "=a"(result)
    : "a"(number), "D"(a1), "S"(a2), "d"(a3)
    : "rcx", "r11", "memory"
  );
  return result;
}

static void write_all(const char *text, uint64_t size) {
  syscall3(1, 1, (long)text, (long)size);
}

void print_and_exit(int64_t value) {
  char buffer[32];
  int index = 32;
  buffer[--index] = '\n';

  uint64_t magnitude = value < 0 ? (uint64_t)(-value) : (uint64_t)value;
  if (magnitude == 0) buffer[--index] = '0';
  while (magnitude > 0) {
    buffer[--index] = (char)('0' + (magnitude % 10));
    magnitude /= 10;
  }
  if (value < 0) buffer[--index] = '-';

  write_all(buffer + index, (uint64_t)(32 - index));
  syscall3(60, 0, 0, 0);
  __builtin_unreachable();
}
