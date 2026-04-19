#include "index.h"

mod_t *
linn_load(path_t *path) {
    file_t *file = open_file_or_fail(path_raw_string(path), "r");
    char *string = file_read_string(file);
    mod_t *mod = make_mod(path);

    // run code

    size_t cursor = 0;
    char *line_string = string_next_line(string, &cursor);
    while (line_string) {
        line_t *line = parse_line(line_string);
        linn_execute(mod, line);
        line_free(line);
        string_free(line_string);
        line_string = string_next_line(string, &cursor);
    }

    string_free(string);

    // patch label references

    record_iter_t iter;
    record_iter_init(&iter, mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (definition_has_function(definition)) {
            function_patch_label_references(definition_function(definition));
        }

        definition = record_iter_next_value(&iter);
    }

    // setup attributes

    // TODO

    return mod;
}
