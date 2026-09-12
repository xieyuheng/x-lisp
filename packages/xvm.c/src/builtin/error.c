#include "index.h"

static value_t error_impl(value_t info, const char *prefix) {
  assert(is_xtext(info));
  buffer_t *buffer = make_buffer();
  write_string(buffer, prefix);
  write_string(buffer, xtext_string(to_xtext(info)));
  write_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_error(value_t info) {
  return error_impl(info, "(error) ");
}

value_t x_error_zh(value_t info) {
  return error_impl(info, "(报错) ");
}

static value_t error_with_location_impl(value_t info, value_t location, const char *prefix) {
  assert(is_xtext(info));
  buffer_t *message_buffer = make_buffer();
  write_string(message_buffer, prefix);
  write_string(message_buffer, xtext_string(to_xtext(info)));
  char *message = buffer_to_string(message_buffer);
  buffer_free(message_buffer);

  buffer_t *output_buffer = make_buffer();
  write_message_with_location(
    output_buffer,
    message,
    value_to_source_location(location));
  buffer_write_and_exit(output_buffer, stderr, 1);
}

value_t x_error_with_location(value_t info, value_t location) {
  return error_with_location_impl(info, location, "(error) ");
}

value_t x_error_with_location_zh(value_t info, value_t location) {
  return error_with_location_impl(info, location, "(报错) ");
}