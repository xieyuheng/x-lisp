#include "index.h"

value_t x_fs_exists_p(value_t path) {
  const char *pathname = xstring_string(to_xstring(path));
  return x_bool(fs_exists(pathname));
}

value_t x_fs_file_p(value_t path) {
  const char *pathname = xstring_string(to_xstring(path));
  return x_bool(fs_is_file(pathname));
}

value_t x_fs_directory_p(value_t path) {
  const char *pathname = xstring_string(to_xstring(path));
  return x_bool(fs_is_directory(pathname));
}

value_t x_fs_read(value_t path) {
  value_t file = x_open_input_file(path);
  value_t content = x_file_read(file);
  x_file_close(file);
  return content;
}

value_t x_fs_write(value_t path, value_t string) {
  value_t file = x_open_output_file(path);
  x_file_write(file, string);
  x_file_close(file);
  return x_void;
}

value_t x_fs_list(value_t path) {
  value_t list = x_make_list();
  DIR *dir = opendir(xstring_string(to_xstring(path)));
  struct dirent *dirent = readdir(dir);
  while (dirent) {
    if (!string_equal(dirent->d_name, ".") &&
        !string_equal(dirent->d_name, "..")) {
      value_t name = x_object(make_xstring(dirent->d_name));
      x_list_push_mut(name, list);
    }

    dirent = readdir(dir);
  }

  closedir(dir);
  return list;
}

value_t x_fs_ensure_file(value_t path) {
  fs_ensure_file(xstring_string(to_xstring(path)));
  return x_void;
}

value_t x_fs_ensure_directory(value_t path) {
  fs_ensure_directory(xstring_string(to_xstring(path)));
  return x_void;
}

value_t x_fs_delete_file(value_t path) {
  fs_delete_file(xstring_string(to_xstring(path)));
  return x_void;
}

value_t x_fs_delete_directory(value_t path) {
  fs_delete_directory(xstring_string(to_xstring(path)));
  return x_void;
}

value_t x_fs_delete(value_t path) {
  fs_delete(xstring_string(to_xstring(path)));
  return x_void;
}

value_t x_fs_rename(value_t old_path, value_t new_path) {
  fs_rename(xstring_string(to_xstring(old_path)), xstring_string(to_xstring(new_path)));
  return x_void;
}
