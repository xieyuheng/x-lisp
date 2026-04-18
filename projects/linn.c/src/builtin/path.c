#include "index.h"

value_t
x_path_base_name(value_t string) {
    path_t *path = make_path(to_xstring(string)->string);
    if (path_segment_length(path) == 0) {
        path_free(path);
        return x_object(make_xstring(string_copy("")));
    } else {
        char *base_name = path_pop_segment(path);
        path_free(path);
        return x_object(make_xstring(base_name));
    }
}

value_t
x_path_directory_name(value_t string) {
    path_t *path = make_path(to_xstring(string)->string);
    if (path_segment_length(path) == 0) {
        if (path_is_absolute(path)) {
            path_free(path);
            return x_object(make_xstring(string_copy("/")));
        } else {
            path_free(path);
            return x_object(make_xstring(string_copy(".")));
        }
    } else {
        char *segment = path_pop_segment(path);
        string_free(segment);
        char *directory_name = string_copy(path_raw_string(path));
        path_free(path);
        return x_object(make_xstring(directory_name));
    }
}

value_t
x_path_extension(value_t string) {
    string = x_path_base_name(string);
    if (string_starts_with(to_xstring(string)->string, ".")) {
        return x_object(make_xstring(string_copy("")));
    }

    int index = string_find_last_char_index(to_xstring(string)->string, '.');
    if (index == -1) {
        return x_object(make_xstring(string_copy("")));
    }

    size_t length = string_length(to_xstring(string)->string);
    char *extension = string_slice(to_xstring(string)->string, index, length);
    return x_object(make_xstring(extension));
}

value_t
x_path_stem(value_t string) {
    string = x_path_base_name(string);
    if (string_starts_with(to_xstring(string)->string, ".")) {
        return string;
    }


    int index = string_find_last_char_index(to_xstring(string)->string, '.');
    if (index == -1) {
        return string;
    }

    char *stem = string_slice(to_xstring(string)->string, 0, index);
    return x_object(make_xstring(stem));
}

value_t
x_path_absolute_p(value_t string) {
    return x_bool(string_starts_with(to_xstring(string)->string, "/"));
}

value_t
x_path_relative_p(value_t string) {
    return x_bool(!string_starts_with(to_xstring(string)->string, "/"));
}

value_t
x_path_join(value_t left, value_t right) {
    path_t *path = make_path(to_xstring(left)->string);
    path_join_mut(path, to_xstring(right)->string);
    char *path_name = string_copy(path_raw_string(path));
    path_free(path);
    return x_object(make_xstring(path_name));
}

value_t
x_path_normalize(value_t string) {
    path_t *path = make_path(to_xstring(string)->string);
    char *path_name = string_copy(path_raw_string(path));
    path_free(path);
    return x_object(make_xstring(path_name));
}
