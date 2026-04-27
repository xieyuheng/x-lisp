#include "index.h"

value_t x_assert(value_t value) {
  if (value == x_true) return x_void;

  buffer_t *buffer = make_buffer();
  format_string(buffer, "(assert) fail");
  format_string(buffer, "\n  value: "); format_value(buffer, value);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_not(value_t value) {
  if (value == x_false) return x_void;

  buffer_t *buffer = make_buffer();
  format_string(buffer, "(assert-not) fail");
  format_string(buffer, "\n  value: "); format_value(buffer, value);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_equal(value_t lhs, value_t rhs) {
  if (equal_p(lhs, rhs)) return x_void;

  buffer_t *buffer = make_buffer();
  format_string(buffer, "(assert-equal) fail");
  format_string(buffer, "\n  lhs: "); format_value(buffer, lhs);
  format_string(buffer, "\n  rhs: "); format_value(buffer, rhs);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_not_equal(value_t lhs, value_t rhs) {
  if (!equal_p(lhs, rhs)) return x_void;

  buffer_t *buffer = make_buffer();
  format_string(buffer, "(assert-not-equal) fail");
  format_string(buffer, "\n  lhs: "); format_value(buffer, lhs);
  format_string(buffer, "\n  rhs: "); format_value(buffer, rhs);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_with_location(value_t value, value_t location) {
  if (value == x_true) return x_void;

  buffer_t *buffer = make_buffer();
  format_string(buffer, "(assert) fail");
  format_string(buffer, "\n  value: "); format_value(buffer, value);
  format_string(buffer, "\n  location: "); format_value(buffer, location);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_not_with_location(value_t value, value_t location) {
  if (value == x_false) return x_void;

  buffer_t *buffer = make_buffer();
  format_string(buffer, "(assert-not) fail");
  format_string(buffer, "\n  value: "); format_value(buffer, value);
  format_string(buffer, "\n  location: "); format_value(buffer, location);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_equal_with_location(value_t lhs, value_t rhs, value_t location) {
  if (equal_p(lhs, rhs)) return x_void;

  buffer_t *buffer = make_buffer();
  format_string(buffer, "(assert-equal) fail");
  format_string(buffer, "\n  lhs: "); format_value(buffer, lhs);
  format_string(buffer, "\n  rhs: "); format_value(buffer, rhs);
  format_string(buffer, "\n  location: "); format_value(buffer, location);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_not_equal_with_location(value_t lhs, value_t rhs, value_t location) {
  if (!equal_p(lhs, rhs)) return x_void;

  buffer_t *buffer = make_buffer();
  format_string(buffer, "(assert-not-equal) fail");
  format_string(buffer, "\n  lhs: "); format_value(buffer, lhs);
  format_string(buffer, "\n  rhs: "); format_value(buffer, rhs);
  format_string(buffer, "\n  location: "); format_value(buffer, location);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}
