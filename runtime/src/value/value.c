#include "index.h"

tag_t value_tag(value_t value);

void
value_print(value_t value, file_t *file) {
    if (value == x_true) {
        fprintf(file, "true");
        return;
    }

    if (value == x_false) {
        fprintf(file, "false");
        return;
    }

    if (x_int_p(value)) {
        fprintf(file, "%ld", to_int64(value));
        return;
    }

    if (x_float_p(value)) {
        char buffer[64];
        sprintf(buffer, "%.17g", to_double(value));
        if (!string_has_char(buffer, '.')) {
            size_t end = string_length(buffer);
            buffer[end] = '.';
            buffer[end + 1] = '0';
            buffer[end + 2] = '\0';
        }

        fprintf(stdout, "%s", buffer);
        return;
    }

    if (x_object_p(value)) {
        object_t *object = as_object(value);
        if (object->spec->print_fn) {
            object->spec->print_fn(object, file);
            return;
        }

        fprintf(file, "(%s 0x%p)", object->spec->name, value);
        return;
    }

    fprintf(file, "(unknown-value 0x%p)", value);
    return;
}
