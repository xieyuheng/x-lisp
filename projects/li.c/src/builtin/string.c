#include "index.h"

value_t x_string_p(value_t value) {
  return x_bool(xstring_p(value));
}

value_t x_string_length(value_t string) {
  return x_int(xstring_length(to_xstring(string)));
}

value_t x_string_empty_p(value_t string) {
  return x_bool(xstring_is_empty(to_xstring(string)));
}

value_t x_string_append(value_t left, value_t right) {
  return x_object(xstring_append(to_xstring(left), to_xstring(right)));
}

value_t x_string_concat(value_t list) {
  string_builder_t *builder = make_string_builder();
  int64_t length = to_int64(x_list_length(list));
  for (int64_t i = 0; i < length; i++) {
    value_t element = x_list_get(x_int(i), list);
    string_builder_append_string(builder, xstring_string(to_xstring(element)));
  }

  char *content = string_builder_produce(builder);
  value_t result = x_object(make_xstring_take(content));
  string_builder_free(builder);
  return result;
}

value_t x_string_join(value_t separator, value_t list) {
  string_builder_t *builder = make_string_builder();
  int64_t length = to_int64(x_list_length(list));
  for (int64_t i = 0; i < length; i++) {
    value_t element = x_list_get(x_int(i), list);
    string_builder_append_string(builder, xstring_string(to_xstring(element)));
    if (i < length - 1) {
      string_builder_append_string(builder, xstring_string(to_xstring(separator)));
    }
  }

  char *content = string_builder_produce(builder);
  value_t result = x_object(make_xstring_take(content));
  string_builder_free(builder);
  return result;
}

value_t x_string_compare_lexical(value_t x, value_t y) {
  return x_int(xstring_compare(to_xstring(x), to_xstring(y)));
}

value_t x_string_to_symbol(value_t string) {
  return x_object(intern_symbol(xstring_string(to_xstring(string))));
}

value_t x_string_chars(value_t string) {
  const text_t *text = xstring_text(to_xstring(string));
  value_t chars = x_object(make_xlist());
  for (size_t i = 0; i < text_length(text); i++) {
    xstring_t *c = make_xstring_take_text(text_subtext(text, i, i + 1));
    x_list_push_mut(x_object(c), chars);
  }

  return chars;
}

value_t x_string_lines(value_t string) {
  const text_t *text = xstring_text(to_xstring(string));
  value_t lines = x_object(make_xlist());
  size_t cursor = 0;
  char *line_string = string_next_line(text_string(text), &cursor);
  while (line_string) {
    xstring_t *line = make_xstring_take(line_string);
    x_list_push_mut(x_object(line), lines);
    line_string = string_next_line(text_string(text), &cursor);
  }

  return lines;
}

value_t x_string_substring(value_t start, value_t end, value_t string) {
  const text_t *text = xstring_text(to_xstring(string));
  return x_object(
    make_xstring_take_text(
      text_subtext(
        text,
        to_int64(start),
        to_int64(end))));
}
