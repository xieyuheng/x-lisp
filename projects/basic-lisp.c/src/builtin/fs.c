#include "index.h"

value_t
x_fs_exists_p(value_t path) {
    const char *pathname = to_xstring(path)->string;
    return x_bool(pathname_exists(pathname));
}

value_t
x_fs_file_p(value_t path) {
    const char *pathname = to_xstring(path)->string;
    return x_bool(pathname_is_file(pathname));
}

value_t
x_fs_directory_p(value_t path) {
    const char *pathname = to_xstring(path)->string;
    return x_bool(pathname_is_directory(pathname));
}

value_t
x_fs_read(value_t path) {
    value_t file = x_open_input_file(path);
    value_t content = x_file_read(file);
    x_file_close(file);
    return content;
}

value_t
x_fs_write(value_t path, value_t string) {
    value_t file = x_open_output_file(path);
    x_file_write(file, string);
    x_file_close(file);
    return x_void;
}

// value_t
// x_fs_list(value_t path) {

// }

// value_t
// x_fs_make_directory(value_t path) {

// }

// value_t
// x_fs_delete_file(value_t path) {

// }

// value_t
// x_fs_delete_directory(value_t path) {

// }

// value_t
// x_fs_delete_recursive(value_t path) {

// }

// value_t
// x_fs_rename(value_t old_path, value_t new_path) {

// }
