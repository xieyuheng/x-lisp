#include "index.h"

value_t x_is_symbol(value_t value) {
  return x_bool(is_symbol(value));
}

value_t x_symbol_length(value_t symbol) {
  return x_int(symbol_length(to_symbol(symbol)));
}

value_t x_symbol_to_text(value_t symbol) {
  return x_object(make_xtext(symbol_string(to_symbol(symbol))));
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
  while (is_cons(list)) {
    value_t element = to_cons(list)->car;
    write_string(buffer, symbol_string(to_symbol(element)));
    list = to_cons(list)->cdr;
  }

  char *content = buffer_to_string(buffer);
  value_t result = x_object(intern_symbol(content));
  string_free(content);
  buffer_free(buffer);
  return result;
}
