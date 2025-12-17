#include "index.h"

value_t x_void =
    ((value_t)
     (X_LITTLE
      | (((uint64_t) '#') << (7 * 8))
      | (((uint64_t) 'v') << (6 * 8))
      | (((uint64_t) 'o') << (5 * 8))
      | (((uint64_t) 'i') << (4 * 8))
      | (((uint64_t) 'd') << (3 * 8))));

bool
void_p(value_t value) {
    return value == x_void;
}

value_t
x_void_p(value_t value) {
    return x_bool(void_p(value));
}
