#include "index.h"

xexe_t *make_xexe(buffer_t *buffer) {
  xexe_t *self = new(xexe_t);
  void *bytes = buffer_raw_bytes(buffer);
  self->header = bytes;
  self->buffer = buffer;
  return self;
}

void xexe_free(xexe_t *self) {
  buffer_free(self->buffer);
}

void xexe_check(xexe_t *self) {
  uint8_t magic[8] = {'x', 'e', 'x', 'e', 0, 0, 0, 0};
  uint8_t machine[8] = {'x', '8', '6', '-', '6', '4', 0, 0};
  assert(memcmp(self->header->magic, magic, 8) == 0);
  assert(memcmp(self->header->machine, machine, 8) == 0);
}

uint64_t xexe_version(xexe_t *xexe) {
  return xexe->header->version;
}
