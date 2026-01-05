#include "index.h"

value_t x_null =
    ((value_t)
     (X_LITTLE
      | (((uint64_t) '#') << (7 * 8))
      | (((uint64_t) 'n') << (6 * 8))
      | (((uint64_t) 'u') << (5 * 8))
      | (((uint64_t) 'l') << (4 * 8))
      | (((uint64_t) 'l') << (3 * 8))));

bool
null_p(value_t value) {
    return value == x_null;
}

value_t
x_null_p(value_t value) {
    return x_bool(null_p(value));
}
