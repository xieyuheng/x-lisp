#include "index.h"

typedef void *(fn_t)(void);

#define PAGE_SIZE 4096
#define PAGE_ALIGN(s) ((((size_t)(s)) + PAGE_SIZE - 1) & ~(PAGE_SIZE - 1))

static uint32_t read_u32_le(const uint8_t *p) {
  return (uint32_t) p[0]
    | ((uint32_t) p[1] << 8)
    | ((uint32_t) p[2] << 16)
    | ((uint32_t) p[3] << 24);
}

void *x86_execute_flat(const buffer_t *buffer) {
  uint8_t *bytes = buffer_raw_bytes(buffer);
  size_t length = buffer_length(buffer);

  void *memory = mmap(
    NULL, length,
    PROT_READ | PROT_WRITE | PROT_EXEC,
    MAP_PRIVATE | MAP_ANONYMOUS,
    -1, 0);

  if (memory == MAP_FAILED) {
    where_printf("[mmap]: %s\n", strerror(errno));
    exit(1);
  }

  memcpy(memory, bytes, length);

  fn_t *fn;
  memcpy(&fn, &memory, sizeof(fn));
  void *result = fn();
  munmap(memory, length);
  return result;
}

void *x86_execute_exe(const buffer_t *buffer) {
  const uint8_t *bytes = buffer_raw_bytes(buffer);
  size_t file_length = buffer_length(buffer);

  if (file_length < 64) {
    where_printf("[x86_execute_exe] file too small: %zu bytes (need >= 64)\n", file_length);
    exit(1);
  }

  if (bytes[0] != 'X' || bytes[1] != '8' || bytes[2] != '6' || bytes[3] != 0x00) {
    where_printf("[x86_execute_exe] bad magic: %02x %02x %02x %02x\n",
                 bytes[0], bytes[1], bytes[2], bytes[3]);
    exit(1);
  }

  uint32_t flags = read_u32_le(bytes + 0x04);
  uint32_t code_size = read_u32_le(bytes + 0x08);
  uint32_t data_size = read_u32_le(bytes + 0x0c);
  uint32_t space_size = read_u32_le(bytes + 0x10);
  uint32_t internal_reloc_count = read_u32_le(bytes + 0x14);
  uint32_t external_reloc_count = read_u32_le(bytes + 0x18);
  (void) external_reloc_count;
  uint32_t entry_offset = read_u32_le(bytes + 0x1c);

  if (flags != 0) {
    where_printf("[x86_execute_exe] unsupported flags: 0x%08x\n", flags);
    exit(1);
  }

  for (size_t i = 0; i < 32; i++) {
    if (bytes[0x20 + i] != 0) {
      where_printf("[x86_execute_exe] unsupported version (non-zero reserved)\n");
      exit(1);
    }
  }

  size_t code_region = PAGE_ALIGN(code_size);
  size_t image_size = code_region + (size_t) data_size + (size_t) space_size;

  void *base = mmap(
    NULL, image_size,
    PROT_READ | PROT_WRITE,
    MAP_PRIVATE | MAP_ANONYMOUS,
    -1, 0);

  if (base == MAP_FAILED) {
    where_printf("[mmap]: %s\n", strerror(errno));
    exit(1);
  }

  memcpy(base, bytes + 64, code_size);
  memcpy((uint8_t *) base + code_region, bytes + 64 + code_size, data_size);

  for (uint32_t i = 0; i < internal_reloc_count; i++) {
    uint32_t offset = read_u32_le(bytes + 64 + code_size + data_size + i * 8);
    uint32_t target = read_u32_le(bytes + 64 + code_size + data_size + i * 8 + 4);
    *(uint64_t *) ((uint8_t *) base + offset) = (uint64_t) ((uint8_t *) base + target);
  }

  if (mprotect(base, code_region, PROT_READ | PROT_EXEC) == -1) {
    where_printf("[mprotect]: %s\n", strerror(errno));
    munmap(base, image_size);
    exit(1);
  }

  fn_t *fn;
  uint8_t *entry = (uint8_t *) base + entry_offset;
  memcpy(&fn, &entry, sizeof(fn));
  void *result = fn();
  munmap(base, image_size);
  return result;
}
