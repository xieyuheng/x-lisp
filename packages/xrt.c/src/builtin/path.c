#include "index.h"

value_t x_path_file_name(value_t string) {
  path_t *path = make_path(xtext_string(to_xtext(string)));
  if (path_segment_length(path) == 0) {
    path_free(path);
    return x_object(make_xtext(""));
  } else {
    char *base_name = path_pop_segment(path);
    path_free(path);
    return x_object(make_xtext_take(base_name));
  }
}

value_t x_path_directory_name(value_t string) {
  path_t *path = make_path(xtext_string(to_xtext(string)));
  if (path_segment_length(path) == 0) {
    if (path_is_absolute(path)) {
      path_free(path);
      return x_object(make_xtext("/"));
    } else {
      path_free(path);
      return x_object(make_xtext("."));
    }
  } else {
    char *segment = path_pop_segment(path);
    string_free(segment);
    char *directory_name = string_copy(path_raw_string(path));
    path_free(path);
    return x_object(make_xtext_take(directory_name));
  }
}

value_t x_path_extension(value_t string) {
  string = x_path_file_name(string);
  if (string_starts_with(xtext_string(to_xtext(string)), ".")) {
    return x_object(make_xtext(""));
  }

  int index = string_find_last_char_index(xtext_string(to_xtext(string)), '.');
  if (index == -1) {
    return x_object(make_xtext(""));
  }

  size_t length = string_length(xtext_string(to_xtext(string)));
  char *extension = string_substring(xtext_string(to_xtext(string)), index, length);
  return x_object(make_xtext_take(extension));
}

value_t x_path_stem(value_t string) {
  string = x_path_file_name(string);
  if (string_starts_with(xtext_string(to_xtext(string)), ".")) {
    return string;
  }


  int index = string_find_last_char_index(xtext_string(to_xtext(string)), '.');
  if (index == -1) {
    return string;
  }

  char *stem = string_substring(xtext_string(to_xtext(string)), 0, index);
  return x_object(make_xtext_take(stem));
}

value_t x_path_is_absolute(value_t string) {
  return x_bool(string_starts_with(xtext_string(to_xtext(string)), "/"));
}

value_t x_path_is_relative(value_t string) {
  return x_bool(!string_starts_with(xtext_string(to_xtext(string)), "/"));
}

value_t x_path_join(value_t left, value_t right) {
  path_t *path = make_path(xtext_string(to_xtext(left)));
  path_join(path, xtext_string(to_xtext(right)));
  char *path_name = string_copy(path_raw_string(path));
  path_free(path);
  return x_object(make_xtext_take(path_name));
}

value_t x_path_normalize(value_t string) {
  path_t *path = make_path(xtext_string(to_xtext(string)));
  char *path_name = string_copy(path_raw_string(path));
  path_free(path);
  return x_object(make_xtext_take(path_name));
}

value_t x_path_resolve(value_t x) {
  if (to_bool(x_path_is_absolute(x)))
    return x;
  return x_path_normalize(x_path_join(x_current_directory(), x));
}

value_t x_path_relative(value_t from, value_t to) {
  value_t resolved_from = x_path_resolve(from);
  value_t resolved_to = x_path_resolve(to);
  path_t *from_path = make_path(xtext_string(to_xtext(resolved_from)));
  path_t *to_path = make_path(xtext_string(to_xtext(resolved_to)));
  path_t *relative_path = path_relative(from_path, to_path);
  char *result = string_copy(path_raw_string(relative_path));
  path_free(from_path);
  path_free(to_path);
  path_free(relative_path);
  return x_object(make_xtext_take(result));
}

value_t x_path_relative_to_cwd(value_t to) {
  value_t resolved_to = x_path_resolve(to);
  value_t cwd = x_current_directory();
  path_t *cwd_path = make_path(xtext_string(to_xtext(cwd)));
  path_t *to_path = make_path(xtext_string(to_xtext(resolved_to)));
  path_t *relative = path_relative(cwd_path, to_path);
  char *result = string_copy(path_raw_string(relative));
  path_free(cwd_path);
  path_free(to_path);
  path_free(relative);
  return x_object(make_xtext_take(result));
}

value_t x_path_exists(value_t path) {
  const char *pathname = xtext_string(to_xtext(path));
  return x_bool(fs_exists(pathname));
}

value_t x_path_is_file(value_t path) {
  const char *pathname = xtext_string(to_xtext(path));
  return x_bool(fs_is_file(pathname));
}

value_t x_path_is_directory(value_t path) {
  const char *pathname = xtext_string(to_xtext(path));
  return x_bool(fs_is_directory(pathname));
}

value_t x_path_read(value_t path) {
  value_t file = x_open_input_file(path);
  value_t content = x_file_read(file);
  x_file_close(file);
  return content;
}

value_t x_path_write(value_t path, value_t string) {
  value_t file = x_open_output_file(path);
  x_file_write(file, string);
  x_file_close(file);
  return x_void;
}

value_t x_path_list(value_t path) {
  value_t list = x_make_list();
  fs_iter_t *iter = fs_make_iter(xtext_string(to_xtext(path)));
  char *name = fs_iter_next(iter);
  while (name) {
    x_list_push_mut(x_object(make_xtext_take(name)), list);
    name = fs_iter_next(iter);
  }
  fs_iter_free(iter);
  return list;
}

value_t x_path_list_recursive(value_t path) {
  value_t list = x_make_list();
  fs_recursive_iter_t *iter = fs_make_recursive_iter(xtext_string(to_xtext(path)));
  char *name = fs_recursive_iter_next(iter);
  while (name) {
    x_list_push_mut(x_object(make_xtext_take(name)), list);
    name = fs_recursive_iter_next(iter);
  }
  fs_recursive_iter_free(iter);
  return list;
}

value_t x_path_ensure_file(value_t path) {
  fs_ensure_file(xtext_string(to_xtext(path)));
  return x_void;
}

value_t x_path_ensure_directory(value_t path) {
  fs_ensure_directory(xtext_string(to_xtext(path)));
  return x_void;
}

value_t x_path_delete_file(value_t path) {
  fs_delete_file(xtext_string(to_xtext(path)));
  return x_void;
}

value_t x_path_delete_directory(value_t path) {
  fs_delete_directory(xtext_string(to_xtext(path)));
  return x_void;
}

value_t x_path_delete(value_t path) {
  fs_delete(xtext_string(to_xtext(path)));
  return x_void;
}

value_t x_path_rename(value_t old_path, value_t new_path) {
  fs_rename(xtext_string(to_xtext(old_path)), xtext_string(to_xtext(new_path)));
  return x_void;
}
