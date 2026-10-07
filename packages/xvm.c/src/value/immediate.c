#include "index.h"

// uint64_t but truncate the lower 3 bits

extern inline value_t x_immediate(uint64_t target) {
  return (target << 3) | X_IMMEDIATE;
}

extern inline bool is_immediate(value_t value) {
  return value_tag(value) == X_IMMEDIATE;
}

extern inline uint64_t to_immediate_uint64(value_t value) {
  assert(is_immediate(value));
  return ((uint64_t) value) >> 3;
}
