#include "index.h"

value_t x_error(value_t info) {
  buffer_t *buffer = make_buffer();
  format_value(buffer, info);
  format_newline(buffer);
  buffer_write_and_exit(buffer, stderr, 1);
}

value_t x_error_with_location(value_t info, value_t location) {
  buffer_t *buffer = make_buffer();
  format_value(buffer, info);
  format_newline(buffer);
  const char *pathname = xstring_string(to_xstring(xrecord_get(to_xrecord(location), "path")));
  struct span_t span = value_to_span(xrecord_get(to_xrecord(location), "span"));
  format_source_location_report(buffer, pathname, span, NULL);
  buffer_write_and_exit(buffer, stderr, 1);
}
