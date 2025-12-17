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

bool
same_p(value_t lhs, value_t rhs) {
    if (object_p(lhs) &&
        object_p(lhs) &&
        to_object(lhs)->spec == to_object(rhs)->spec &&
        to_object(lhs)->spec->same_fn != NULL)
    {
        return to_object(lhs)->spec->same_fn(to_object(lhs), to_object(rhs));
    }

    return lhs == rhs;
}

bool
equal_p(value_t lhs, value_t rhs) {
    if (object_p(lhs) &&
        object_p(lhs) &&
        to_object(lhs)->spec == to_object(rhs)->spec &&
        to_object(lhs)->spec->equal_fn != NULL)
    {
        return to_object(lhs)->spec->equal_fn(to_object(lhs), to_object(rhs));
    }

    return same_p(lhs, rhs);
}

value_t
x_anything_p(value_t x) {
    (void) x;
    return x_bool(true);
}

value_t
x_same_p(value_t lhs, value_t rhs) {
    if (object_p(lhs) &&
        object_p(lhs) &&
        to_object(lhs)->spec == to_object(rhs)->spec &&
        to_object(lhs)->spec->same_fn != NULL)
    {
        return x_bool(to_object(lhs)->spec->same_fn(to_object(lhs), to_object(rhs)));
    }

    return x_bool(lhs == rhs);
}

value_t
x_equal_p(value_t lhs, value_t rhs) {
    if (object_p(lhs) &&
        object_p(lhs) &&
        to_object(lhs)->spec == to_object(rhs)->spec &&
        to_object(lhs)->spec->equal_fn != NULL)
    {
        return x_bool(to_object(lhs)->spec->equal_fn(to_object(lhs), to_object(rhs)));
    }

    return x_same_p(lhs, rhs);
}
