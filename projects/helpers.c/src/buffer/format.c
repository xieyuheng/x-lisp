#include "index.h"

void int_format(buffer_t *buffer, int64_t self) {
  buffer_printf(buffer, "%" PRId64, self);
}

void uint_format(buffer_t *buffer, uint64_t self) {
  buffer_printf(buffer, "%" PRIu64, self);
}
