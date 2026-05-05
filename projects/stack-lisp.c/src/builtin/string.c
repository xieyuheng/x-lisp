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

value_t x_string_blank_p(value_t string) {
  return x_bool(string_is_blank(xstring_string(to_xstring(string))));
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

value_t x_string_append(value_t left, value_t right) {
  return x_object(xstring_append(to_xstring(left), to_xstring(right)));
}

value_t x_string_concat(value_t list) {
  buffer_t *buffer = make_buffer();
  int64_t length = to_int64(x_list_length(list));
  for (int64_t i = 0; i < length; i++) {
    value_t element = x_list_get(x_int(i), list);
    format_string(buffer, xstring_string(to_xstring(element)));
  }

  char *content = buffer_to_string(buffer);
  value_t result = x_object(make_xstring_take(content));
  buffer_free(buffer);
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
    x_list_push_mut(x_object(make_xstring_take(line_string)), lines);
    line_string = string_next_line(text_string(text), &cursor);
  }

  return lines;
}

value_t x_string_split(value_t delimiter, value_t string) {
  const text_t *text = xstring_text(to_xstring(string));
  const char *delimiter_string = xstring_string(to_xstring(delimiter));
  value_t parts = x_object(make_xlist());
  size_t cursor = 0;
  char *substring = string_next_split(text_string(text), delimiter_string, &cursor);
  while (substring) {
    x_list_push_mut(x_object(make_xstring_take(substring)), parts);
    substring = string_next_split(text_string(text), delimiter_string, &cursor);
  }

  return parts;
}

value_t x_string_join(value_t separator, value_t list) {
  buffer_t *buffer = make_buffer();
  int64_t length = to_int64(x_list_length(list));
  for (int64_t i = 0; i < length; i++) {
    value_t element = x_list_get(x_int(i), list);
    format_string(buffer, xstring_string(to_xstring(element)));
    if (i < length - 1) {
      format_string(buffer, xstring_string(to_xstring(separator)));
    }
  }

  char *content = buffer_to_string(buffer);
  value_t result = x_object(make_xstring_take(content));
  buffer_free(buffer);
  return result;
}

value_t x_string_replace(value_t pattern, value_t replacement, value_t string) {
  const text_t *text = xstring_text(to_xstring(string));
  const char *pattern_string = xstring_string(to_xstring(pattern));
  const char *replacement_string = xstring_string(to_xstring(replacement));
  buffer_t *buffer = make_buffer();
  size_t cursor = 0;
  char *substring = string_next_split(text_string(text), pattern_string, &cursor);
  while (substring) {
    format_string(buffer, substring);
    substring = string_next_split(text_string(text), pattern_string, &cursor);
    if (substring) {
        format_string(buffer, replacement_string);
    }
  }

  value_t result = x_object(make_xstring_take(buffer_to_string(buffer)));
  buffer_free(buffer);
  return result;
}

value_t x_string_starts_with_p(value_t prefix, value_t string) {
  return x_bool(
    string_starts_with(
      xstring_string(to_xstring(string)),
      xstring_string(to_xstring(prefix))));
}

value_t x_string_ends_with_p(value_t suffix, value_t string) {
  return x_bool(
    string_ends_with(
      xstring_string(to_xstring(string)),
      xstring_string(to_xstring(suffix))));
}

value_t x_string_to_upper_case(value_t string) {
  return x_object(
    make_xstring_take(
      string_to_upper_case(
        xstring_string(to_xstring(string)))));
}

value_t x_string_to_lower_case(value_t string) {
  return x_object(
    make_xstring_take(
      string_to_lower_case(
        xstring_string(to_xstring(string)))));
}

value_t x_string_get_code_point(value_t index, value_t string) {
  return x_int(
    text_get_code_point(
      xstring_text(to_xstring(string)),
      to_int64(index)));
}

value_t x_string_contains_p(value_t substring, value_t string) {
  return x_bool(
    string_contains(
      xstring_string(to_xstring(string)),
      xstring_string(to_xstring(substring))));
}

value_t x_string_find_index(value_t substring, value_t string) {
  return x_int(
    text_find_subtext_index(
      xstring_text(to_xstring(string)),
      xstring_text(to_xstring(substring))));
}

value_t x_string_trim_left(value_t string) {
  return x_object(
    make_xstring_take(
      string_trim_left(
        xstring_string(to_xstring(string)))));
}

value_t x_string_trim_right(value_t string) {
  return x_object(
    make_xstring_take(
      string_trim_right(
        xstring_string(to_xstring(string)))));
}

value_t x_string_trim_start(value_t string) {
  return x_object(
    make_xstring_take(
      string_trim_start(
        xstring_string(to_xstring(string)))));
}

value_t x_string_trim_end(value_t string) {
  return x_object(
    make_xstring_take(
      string_trim_end(
        xstring_string(to_xstring(string)))));
}

value_t x_string_trim(value_t string) {
  return x_object(
    make_xstring_take(
      string_trim(
        xstring_string(to_xstring(string)))));
}

value_t x_string_int_p(value_t string) {
  assert(xstring_p(string));
  const char *str = xstring_string(to_xstring(string));
  return x_bool(string_is_int(str) && !string_contains(str, "."));
}

value_t x_string_float_p(value_t string) {
  assert(xstring_p(string));
  const char *str = xstring_string(to_xstring(string));
  return x_bool(string_is_double(str) && string_contains(str, "."));
}
