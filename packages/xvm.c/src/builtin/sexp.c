#include "index.h"

value_t x_parse_sexps(value_t path, value_t string) {
  return parse_located_sexps(
    xtext_string(to_xtext(path)),
    xtext_string(to_xtext(string)));
}

value_t x_format_as_sexp(value_t sexp) {
  buffer_t *buffer = make_buffer();
  write_as_sexp(buffer, sexp);
  value_t result = x_object(make_xtext_take(buffer_to_string(buffer)));
  buffer_free(buffer);
  return result;
}

value_t x_format_message_with_location(value_t message, value_t location) {
  buffer_t *buffer = make_buffer();
  write_message_with_location(
    buffer,
    xtext_string(to_xtext(message)),
    value_to_source_location(location));
  value_t result = x_object(make_xtext_take(buffer_to_string(buffer)));
  buffer_free(buffer);
  return result;
}

value_t x_parse_sexps_zh(value_t path, value_t string) {
  return parse_located_sexps_zh(
    xtext_string(to_xtext(path)),
    xtext_string(to_xtext(string)));
}
