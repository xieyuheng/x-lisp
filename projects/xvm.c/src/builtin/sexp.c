#include "index.h"

value_t x_parse_sexps(value_t path, value_t string) {
  return parse_located_sexps(
    xstring_string(to_xstring(path)),
    xstring_string(to_xstring(string)));
}

value_t x_format_as_sexp(value_t sexp) {
  buffer_t *buffer = make_buffer();
  format_as_sexp(buffer, sexp);
  value_t result = x_object(make_xstring_take(buffer_to_string(buffer)));
  buffer_free(buffer);
  return result;
}

value_t x_format_message_with_source_location(value_t message, value_t location) {
  buffer_t *buffer = make_buffer();
  format_message_with_source_location(
    buffer,
    xstring_string(to_xstring(message)),
    value_to_source_location(location));
  value_t result = x_object(make_xstring_take(buffer_to_string(buffer)));
  buffer_free(buffer);
  return result;
}
