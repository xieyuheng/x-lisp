#include "index.h"

value_t x_is_text(value_t value) {
  return x_bool(is_xtext(value));
}

value_t x_text_length(value_t string) {
  return x_int(xtext_length(to_xtext(string)));
}

value_t x_text_is_empty(value_t string) {
  return x_bool(xtext_is_empty(to_xtext(string)));
}

value_t x_text_is_blank(value_t string) {
  return x_bool(string_is_blank(xtext_string(to_xtext(string))));
}

value_t x_text_slice(value_t start, value_t end, value_t string) {
  const text_t *text = xtext_text(to_xtext(string));
  return x_object(
    make_xtext_take_text(
      text_subtext(
        text,
        to_int64(start),
        to_int64(end))));
}

value_t x_text_append(value_t left, value_t right) {
  return x_object(xtext_append(to_xtext(left), to_xtext(right)));
}

value_t x_text_concat(value_t list) {
  buffer_t *buffer = make_buffer();
  while (is_cons(list)) {
    value_t element = to_cons(list)->car;
    write_string(buffer, xtext_string(to_xtext(element)));
    list = to_cons(list)->cdr;
  }

  char *content = buffer_to_string(buffer);
  value_t result = x_object(make_xtext_take(content));
  buffer_free(buffer);
  return result;
}

value_t x_text_compare_lexical(value_t x, value_t y) {
  return x_int(xtext_compare(to_xtext(x), to_xtext(y)));
}

value_t x_text_to_symbol(value_t string) {
  return x_object(intern_symbol(xtext_string(to_xtext(string))));
}

value_t x_text_chars(value_t string) {
  const text_t *text = xtext_text(to_xtext(string));
  list_builder_t result = list_builder_empty();
  for (size_t i = 0; i < text_length(text); i++) {
    xtext_t *c = make_xtext_take_text(text_subtext(text, i, i + 1));
    list_builder_append(&result, x_object(c));
  }

  return list_builder_result(&result);
}

value_t x_text_lines(value_t string) {
  const text_t *text = xtext_text(to_xtext(string));
  list_builder_t result = list_builder_empty();
  size_t cursor = 0;
  char *line_string = string_next_line(text_string(text), &cursor);
  while (line_string) {
    list_builder_append(&result, x_object(make_xtext_take(line_string)));
    line_string = string_next_line(text_string(text), &cursor);
  }

  return list_builder_result(&result);
}

value_t x_text_split(value_t delimiter, value_t string) {
  const text_t *text = xtext_text(to_xtext(string));
  const char *delimiter_string = xtext_string(to_xtext(delimiter));
  list_builder_t result = list_builder_empty();
  size_t cursor = 0;
  char *substring = string_next_split(text_string(text), delimiter_string, &cursor);
  while (substring) {
    list_builder_append(&result, x_object(make_xtext_take(substring)));
    substring = string_next_split(text_string(text), delimiter_string, &cursor);
  }

  return list_builder_result(&result);
}

value_t x_text_join(value_t separator, value_t list) {
  buffer_t *buffer = make_buffer();
  bool first = true;
  while (is_cons(list)) {
    if (!first) {
      write_string(buffer, xtext_string(to_xtext(separator)));
    }
    first = false;
    write_string(buffer, xtext_string(to_xtext(to_cons(list)->car)));
    list = to_cons(list)->cdr;
  }

  char *content = buffer_to_string(buffer);
  value_t result = x_object(make_xtext_take(content));
  buffer_free(buffer);
  return result;
}

value_t x_text_replace(value_t pattern, value_t replacement, value_t string) {
  const text_t *text = xtext_text(to_xtext(string));
  const char *pattern_string = xtext_string(to_xtext(pattern));
  const char *replacement_string = xtext_string(to_xtext(replacement));
  buffer_t *buffer = make_buffer();
  size_t cursor = 0;
  char *substring = string_next_split(text_string(text), pattern_string, &cursor);
  while (substring) {
    write_string(buffer, substring);
    substring = string_next_split(text_string(text), pattern_string, &cursor);
    if (substring) {
        write_string(buffer, replacement_string);
    }
  }

  value_t result = x_object(make_xtext_take(buffer_to_string(buffer)));
  buffer_free(buffer);
  return result;
}

value_t x_text_is_prefix(value_t prefix, value_t string) {
  return x_bool(
    string_starts_with(
      xtext_string(to_xtext(string)),
      xtext_string(to_xtext(prefix))));
}

value_t x_text_is_suffix(value_t suffix, value_t string) {
  return x_bool(
    string_ends_with(
      xtext_string(to_xtext(string)),
      xtext_string(to_xtext(suffix))));
}

value_t x_text_to_upper_case(value_t string) {
  return x_object(
    make_xtext_take(
      string_to_upper_case(
        xtext_string(to_xtext(string)))));
}

value_t x_text_to_lower_case(value_t string) {
  return x_object(
    make_xtext_take(
      string_to_lower_case(
        xtext_string(to_xtext(string)))));
}

value_t x_text_get_code_point(value_t index, value_t string) {
  return x_int(
    text_get_code_point(
      xtext_text(to_xtext(string)),
      to_int64(index)));
}

value_t x_text_include(value_t substring, value_t string) {
  return x_bool(
    string_contains(
      xtext_string(to_xtext(string)),
      xtext_string(to_xtext(substring))));
}

value_t x_text_find_index(value_t substring, value_t string) {
  return x_int(
    text_find_subtext_index(
      xtext_text(to_xtext(string)),
      xtext_text(to_xtext(substring))));
}

value_t x_text_trim_left(value_t string) {
  return x_object(
    make_xtext_take(
      string_trim_left(
        xtext_string(to_xtext(string)))));
}

value_t x_text_trim_right(value_t string) {
  return x_object(
    make_xtext_take(
      string_trim_right(
        xtext_string(to_xtext(string)))));
}

value_t x_text_trim_start(value_t string) {
  return x_object(
    make_xtext_take(
      string_trim_start(
        xtext_string(to_xtext(string)))));
}

value_t x_text_trim_end(value_t string) {
  return x_object(
    make_xtext_take(
      string_trim_end(
        xtext_string(to_xtext(string)))));
}

value_t x_text_trim(value_t string) {
  return x_object(
    make_xtext_take(
      string_trim(
        xtext_string(to_xtext(string)))));
}

value_t x_text_is_int(value_t string) {
  assert(is_xtext(string));
  const char *str = xtext_string(to_xtext(string));
  return x_bool(string_is_int(str) && !string_contains(str, "."));
}

value_t x_text_is_float(value_t string) {
  assert(is_xtext(string));
  const char *str = xtext_string(to_xtext(string));
  return x_bool(string_is_double(str) && string_contains(str, "."));
}

value_t x_text_to_int(value_t string) {
  assert(is_xtext(string));
  const char *str = xtext_string(to_xtext(string));
  assert(string_is_int(str));
  return x_int(string_parse_int(str));
}

value_t x_text_to_float(value_t string) {
  assert(is_xtext(string));
  const char *str = xtext_string(to_xtext(string));
  assert(string_is_double(str));
  return x_float(string_parse_double(str));
}
