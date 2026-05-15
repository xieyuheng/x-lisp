#include "index.h"

value_t x_error(value_t info) {
  buffer_t *buffer = make_buffer();
  format_string(buffer, "(error) ");
  format_value(buffer, info);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_error_with_location(value_t info, value_t location) {
  buffer_t *message_buffer = make_buffer();
  format_string(message_buffer, "(error) ");
  format_value(message_buffer, info);
  char *message = buffer_to_string(message_buffer);
  buffer_free(message_buffer);

  buffer_t *output_buffer = make_buffer();
  format_message_with_source_location(
    output_buffer,
    message,
    value_to_source_location(location));
  buffer_write_and_exit(output_buffer, stderr, 1);
}
