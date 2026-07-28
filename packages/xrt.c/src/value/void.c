#include "index.h"

bool is_void(value_t value) {
  return value == x_void;
}

value_t x_is_void(value_t value) {
  return x_bool(is_void(value));
}
