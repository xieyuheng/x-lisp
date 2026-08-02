#include "index.h"

value_t x_assert(value_t value) {
  if (value == x_true) return x_void;

  buffer_t *buffer = make_buffer();
  write_string(buffer, "(assert) fail");
  write_string(buffer, "\n  value: "); write_value(buffer, value);
  write_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_not(value_t value) {
  if (value == x_false) return x_void;

  buffer_t *buffer = make_buffer();
  write_string(buffer, "(assert-not) fail");
  write_string(buffer, "\n  value: "); write_value(buffer, value);
  write_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_equal(value_t lhs, value_t rhs) {
  if (equal(lhs, rhs)) return x_void;

  buffer_t *buffer = make_buffer();
  write_string(buffer, "(assert-equal) fail");
  write_string(buffer, "\n  lhs: "); write_value(buffer, lhs);
  write_string(buffer, "\n  rhs: "); write_value(buffer, rhs);
  write_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_not_equal(value_t lhs, value_t rhs) {
  if (!equal(lhs, rhs)) return x_void;

  buffer_t *buffer = make_buffer();
  write_string(buffer, "(assert-not-equal) fail");
  write_string(buffer, "\n  lhs: "); write_value(buffer, lhs);
  write_string(buffer, "\n  rhs: "); write_value(buffer, rhs);
  write_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_assert_with_location(value_t value, value_t location) {
  if (value == x_true) return x_void;

  buffer_t *message_buffer = make_buffer();
  write_string(message_buffer, "(assert) fail");
  write_string(message_buffer, "\n  value: "); write_value(message_buffer, value);
  char *message = buffer_to_string(message_buffer);
  buffer_free(message_buffer);

  buffer_t *output_buffer = make_buffer();
  write_message_with_location(
    output_buffer,
    message,
    value_to_source_location(location));
  buffer_write_and_exit(output_buffer, stderr, 1);
}

value_t x_assert_not_with_location(value_t value, value_t location) {
  if (value == x_false) return x_void;

  buffer_t *message_buffer = make_buffer();
  write_string(message_buffer, "(assert-not) fail");
  write_string(message_buffer, "\n  value: "); write_value(message_buffer, value);
  char *message = buffer_to_string(message_buffer);
  buffer_free(message_buffer);

  buffer_t *output_buffer = make_buffer();
  write_message_with_location(
    output_buffer,
    message,
    value_to_source_location(location));
  buffer_write_and_exit(output_buffer, stderr, 1);
}

value_t x_assert_equal_with_location(value_t lhs, value_t rhs, value_t location) {
  if (equal(lhs, rhs)) return x_void;

  buffer_t *message_buffer = make_buffer();
  write_string(message_buffer, "(assert-equal) fail");
  write_string(message_buffer, "\n  lhs: "); write_value(message_buffer, lhs);
  write_string(message_buffer, "\n  rhs: "); write_value(message_buffer, rhs);
  char *message = buffer_to_string(message_buffer);
  buffer_free(message_buffer);

  buffer_t *output_buffer = make_buffer();
  write_message_with_location(
    output_buffer,
    message,
    value_to_source_location(location));
  buffer_write_and_exit(output_buffer, stderr, 1);
}

value_t x_assert_not_equal_with_location(value_t lhs, value_t rhs, value_t location) {
  if (!equal(lhs, rhs)) return x_void;

  buffer_t *message_buffer = make_buffer();
  write_string(message_buffer, "(assert-not-equal) fail");
  write_string(message_buffer, "\n  lhs: "); write_value(message_buffer, lhs);
  write_string(message_buffer, "\n  rhs: "); write_value(message_buffer, rhs);
  char *message = buffer_to_string(message_buffer);
  buffer_free(message_buffer);

  buffer_t *output_buffer = make_buffer();
  write_message_with_location(
    output_buffer,
    message,
    value_to_source_location(location));
  buffer_write_and_exit(output_buffer, stderr, 1);
}
