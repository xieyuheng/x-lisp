#include "index.h"

value_t x_error(value_t info) {
  assert(is_xtext(info));
  buffer_t *buffer = make_buffer();
  write_string(buffer, "(error) ");
  write_string(buffer, xtext_string(to_xtext(info)));
  write_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_error_with_location(value_t info, value_t location) {
  assert(is_xtext(info));
  buffer_t *message_buffer = make_buffer();
  write_string(message_buffer, "(error) ");
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
