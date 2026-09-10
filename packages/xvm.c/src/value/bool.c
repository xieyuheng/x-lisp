#include "index.h"

value_t x_bool(bool target) {
  return target ? x_true : x_false;
}

bool is_bool(value_t value) {
  return value == x_true || value == x_false;
}

bool is_true(value_t value) {
  return value == x_true;
}

bool is_false(value_t value) {
  return value == x_false;
}

bool to_bool(value_t value) {
  assert(is_bool(value));
  return value == x_true;
}

value_t x_is_bool(value_t value) {
  return x_bool(is_bool(value));
}

value_t x_not(value_t x) {
  return x_bool(!to_bool(x));
}
