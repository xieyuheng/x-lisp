#include "index.h"

void format_int(buffer_t *buffer, int64_t self) {
  buffer_printf(buffer, "%" PRId64, self);
}

void format_uint(buffer_t *buffer, uint64_t self) {
  buffer_printf(buffer, "%" PRIu64, self);
}

void format_string(buffer_t *buffer, const char *self) {
  buffer_printf(buffer, "%s" , self);
}
