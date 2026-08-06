#include "index.h"

value_t x_is_atom(value_t value) {
  return x_bool(is_atom(value));
}

value_t x_same(value_t lhs, value_t rhs) {
  return x_bool(same(lhs, rhs));
}

value_t x_equal(value_t lhs, value_t rhs) {
  if (is_object(lhs)
    && is_object(rhs)
    && to_object(lhs)->header.class == to_object(rhs)->header.class
    && to_object(lhs)->header.class->equal_fn != NULL) {
    return x_bool(to_object(lhs)->header.class->equal_fn(to_object(lhs), to_object(rhs)));
  }

  return x_same(lhs, rhs);
}

value_t x_format(value_t value) {
  buffer_t *buffer = make_buffer();
  write_value(buffer, value);
  value_t result = x_object(make_xtext_take(buffer_to_string(buffer)));
  buffer_free(buffer);
  return result;
}

value_t x_hash_code(value_t value) {
  return x_int(value_hash_code(value));
}

value_t x_total_compare(value_t lhs, value_t rhs) {
  return x_int(value_total_compare(lhs, rhs));
}
