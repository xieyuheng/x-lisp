#include "index.h"

value_t x_symbol_p(value_t value) {
  return x_bool(symbol_p(value));
}

value_t x_symbol_length(value_t symbol) {
  return x_int(symbol_length(to_symbol(symbol)));
}

value_t x_symbol_to_string(value_t symbol) {
  return x_object(make_xstring(symbol_string(to_symbol(symbol))));
}

value_t x_symbol_append(value_t left, value_t right) {
  char *string = string_append(
    symbol_string(to_symbol(left)),
    symbol_string(to_symbol(right)));
  symbol_t *symbol = intern_symbol(string);
  string_free(string);
  return x_object(symbol);
}

value_t x_symbol_concat(value_t list) {
  buffer_t *buffer = make_buffer();
  int64_t length = to_int64(x_list_length(list));
  for (int64_t i = 0; i < length; i++) {
    value_t element = x_list_get(x_int(i), list);
    buffer_append_string(buffer, symbol_string(to_symbol(element)));
  }

  char *content = buffer_to_string(buffer);
  value_t result = x_object(intern_symbol(content));
  string_free(content);
  buffer_free(buffer);
  return result;
}
