#include "index.h"

value_t x_path_base_name(value_t string) {
  path_t *path = make_path(xstring_string(to_xstring(string)));
  if (path_segment_length(path) == 0) {
    path_free(path);
    return x_object(make_xstring(""));
  } else {
    char *base_name = path_pop_segment(path);
    path_free(path);
    return x_object(make_xstring_take(base_name));
  }
}

value_t x_path_directory_name(value_t string) {
  path_t *path = make_path(xstring_string(to_xstring(string)));
  if (path_segment_length(path) == 0) {
    if (path_is_absolute(path)) {
      path_free(path);
      return x_object(make_xstring("/"));
    } else {
      path_free(path);
      return x_object(make_xstring("."));
    }
  } else {
    char *segment = path_pop_segment(path);
    string_free(segment);
    char *directory_name = string_copy(path_raw_string(path));
    path_free(path);
    return x_object(make_xstring_take(directory_name));
  }
}

value_t x_path_extension(value_t string) {
  string = x_path_base_name(string);
  if (string_starts_with(xstring_string(to_xstring(string)), ".")) {
    return x_object(make_xstring(""));
  }

  int index = string_find_last_char_index(xstring_string(to_xstring(string)), '.');
  if (index == -1) {
    return x_object(make_xstring(""));
  }

  size_t length = string_length(xstring_string(to_xstring(string)));
  char *extension = string_substring(xstring_string(to_xstring(string)), index, length);
  return x_object(make_xstring_take(extension));
}

value_t x_path_stem(value_t string) {
  string = x_path_base_name(string);
  if (string_starts_with(xstring_string(to_xstring(string)), ".")) {
    return string;
  }


  int index = string_find_last_char_index(xstring_string(to_xstring(string)), '.');
  if (index == -1) {
    return string;
  }

  char *stem = string_substring(xstring_string(to_xstring(string)), 0, index);
  return x_object(make_xstring_take(stem));
}

value_t x_path_absolute_p(value_t string) {
  return x_bool(string_starts_with(xstring_string(to_xstring(string)), "/"));
}

value_t x_path_relative_p(value_t string) {
  return x_bool(!string_starts_with(xstring_string(to_xstring(string)), "/"));
}

value_t x_path_join(value_t left, value_t right) {
  path_t *path = make_path(xstring_string(to_xstring(left)));
  path_join(path, xstring_string(to_xstring(right)));
  char *path_name = string_copy(path_raw_string(path));
  path_free(path);
  return x_object(make_xstring_take(path_name));
}

value_t x_path_normalize(value_t string) {
  path_t *path = make_path(xstring_string(to_xstring(string)));
  char *path_name = string_copy(path_raw_string(path));
  path_free(path);
  return x_object(make_xstring_take(path_name));
}
