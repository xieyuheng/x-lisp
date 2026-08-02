#include "index.h"

value_t x_parse_json(value_t string) {
  return parse_json(xstring_string(to_xstring(string)));
}

value_t x_format_json(value_t json) {
  buffer_t *buffer = make_buffer();
  write_json(buffer, json);
  value_t result = x_object(make_xstring_take(buffer_to_string(buffer)));
  buffer_free(buffer);
  return result;
}

value_t x_parse_json_zh(value_t string) {
  return parse_json_zh(xstring_string(to_xstring(string)));
}

value_t x_format_json_zh(value_t json) {
  buffer_t *buffer = make_buffer();
  write_json_zh(buffer, json);
  value_t result = x_object(make_xstring_take(buffer_to_string(buffer)));
  buffer_free(buffer);
  return result;
}

