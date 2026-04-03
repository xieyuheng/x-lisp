#include "index.h"

value_t
x_path_base_name(value_t string) {
    path_t *path = make_path(to_xstring(string)->string);
    if (path_segment_length(path) == 0) {
        path_free(path);
        return x_object(make_xstring(string_copy("")));
    } else {
        char *segment = path_pop_segment(path);
        path_free(path);
        return x_object(make_xstring(segment));
    }
}

// value_t
// x_path_directory_name(value_t string) {
//     path_t *path = make_path(to_xstring(string)->string);
//     if (path_segment_length(path) == 0) {
//         path_free(path);
//         return x_object(make_xstring(string_copy("")));
//     } else {
//         char *segment = path_pop_segment(path);
//         path_free(path);
//         return x_object(make_xstring(segment));
//     }
// }
