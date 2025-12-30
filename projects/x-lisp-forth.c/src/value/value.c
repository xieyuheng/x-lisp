#include "index.h"

inline tag_t value_tag(value_t value) {
    return (size_t) value & TAG_MASK;
}

void
value_print(value_t value) {
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

        printf("%s", buffer);
        return;
    }

    if (object_p(value)) {
        object_print(to_object(value));
        return;
    }

    printf("#<unknown-value 0x%lx>", value);
    return;
}

bool
same_p(value_t lhs, value_t rhs) {
    return lhs == rhs;
}

bool
equal_p(value_t lhs, value_t rhs) {
    if (same_p(lhs, rhs)) return true;

    if (object_p(lhs)
        && object_p(rhs)
        && to_object(lhs)->header.class == to_object(rhs)->header.class
        && to_object(lhs)->header.class->equal_fn != NULL) {
        return to_object(lhs)->header.class->equal_fn(to_object(lhs), to_object(rhs));
    }

    return false;
}

uint64_t
value_hash_code(value_t value) {
    if (int_p(value)) {
        return value;
    }

    if (float_p(value)) {
        return value;
    }

    if (object_p(value)) {
        object_t *object = to_object(value);
        if (object->header.class->hash_code_fn) {
            return object->header.class->hash_code_fn(object);
        } else {
            who_printf("unhandled object: "); object_print(object); newline();
            exit(1);
        }
    }

    who_printf("unhandled value: "); value_print(value); newline();
    exit(1);
}

value_t
x_any_p(value_t x) {
    (void) x;
    return x_bool(true);
}

value_t
x_same_p(value_t lhs, value_t rhs) {
    return x_bool(lhs == rhs);
}

value_t
x_equal_p(value_t lhs, value_t rhs) {
    if (object_p(lhs)
        && object_p(rhs)
        && to_object(lhs)->header.class == to_object(rhs)->header.class
        && to_object(lhs)->header.class->equal_fn != NULL) {
        return x_bool(to_object(lhs)->header.class->equal_fn(to_object(lhs), to_object(rhs)));
    }

    return x_same_p(lhs, rhs);
}

value_t
x_hash_code(value_t value) {
    return x_int(value_hash_code(value));
}

void
init_constant_values(void) {
    x_true = x_object(intern_hashtag("t"));
    x_false = x_object(intern_hashtag("f"));
    x_null = x_object(intern_hashtag("null"));
    x_void = x_object(intern_hashtag("void"));
}
