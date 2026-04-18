#include "index.h"

mod_t *
linn_load(path_t *path) {
    file_t *file = open_file_or_fail(path_raw_string(path), "r");
    char *string = file_read_string(file);
    mod_t *mod = make_mod(path);
    size_t cursor = 0;
    char *line_string = string_next_line(string, &cursor);
    while (line_string) {
        line_t *line = parse_line(line_string);
        line_print(line);
        line_free(line);

        string_free(line_string);
        line_string = string_next_line(string, &cursor);
    }

    return mod;
}
