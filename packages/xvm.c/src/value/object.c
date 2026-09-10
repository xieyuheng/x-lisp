#include "index.h"

inline value_t x_object(void *target) {
  return (uint64_t) target | X_OBJECT;
}

inline bool is_object(value_t value) {
  return value_tag(value) == X_OBJECT;
}

inline object_t *to_object(value_t value) {
  assert(is_object(value));
  return (object_t *) (value & PAYLOAD_MASK);
}
