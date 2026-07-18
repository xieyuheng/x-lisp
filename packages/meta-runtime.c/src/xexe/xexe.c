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

uint64_t xexe_version(xexe_t *xexe) {
  return xexe->header->version;
}
