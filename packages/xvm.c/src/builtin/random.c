#include "index.h"

// [start, end)

value_t x_random_int(value_t start, value_t end) {
  return x_int(random_int(to_int64(start), to_int64(end)));
}

value_t x_random_float(value_t start, value_t end) {
  return x_float(random_float(to_double(start), to_double(end)));
}
