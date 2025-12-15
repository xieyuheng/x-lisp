#include "index.h"

inline tag_t value_tag(value_t value) {
    return (size_t) value & TAG_MASK;
}

void
value_print(value_t value) {
    if (value == x_true) {
        printf("#t");
        return;
    }

    if (value == x_false) {
        printf("#f");
        return;
    }

    if (value == x_void) {
        printf("#void");
        return;
    }

    if (value == x_null) {
        printf("#null");
        return;
    }

    if (int_p(value)) {
        printf("%ld", to_int64(value));
        return;
    }

    if (float_p(value)) {
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

    if (address_p(value)) {
        printf("(@address %p)", (void *) to_address(value));
        return;
    }

    if (object_p(value)) {
        object_t *object = to_object(value);
        if (object->spec->print_fn) {
            object->spec->print_fn(object);
            return;
        }

        printf("(%s 0x%p)", object->spec->name, value);
        return;
    }

    printf("(unknown-value 0x%p)", value);
    return;
}
