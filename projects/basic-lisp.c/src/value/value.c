#include "index.h"

inline tag_t value_tag(value_t value) {
    return (size_t) value & TAG_MASK;
}

void
value_print(printer_t *printer, value_t value) {
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
        object_t *object = to_object(value);
        if (printer_circle_start_p(printer, object)) {
            printf("#%ld=", printer_circle_index(printer, object));
            printer_meet(printer, object);
            object_print(printer, object);
            return;
        } else if (printer_circle_end_p(printer, object)) {
            printf("#%ld#", printer_circle_index(printer, object));
            return;
        } else {
            object_print(printer, object);
            return;
        }
    }

    printf("#<unknown-value 0x%lx>", value);
    return;
}

void
print(value_t value) {
    printer_t *printer = make_printer();
    if (object_p(value)) {
        printer_collect_circle(printer, to_object(value));
        set_clear(printer->occurred_objects);
    }

    value_print(printer, value);
    printer_free(printer);
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

hash_code_t
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
            who_printf("unhandled object: "); print(value); newline();
            exit(1);
        }
    }

    who_printf("unhandled value: "); print(value); newline();
    exit(1);
}

ordering_t
value_total_compare(value_t lhs, value_t rhs) {
    if (same_p(lhs, rhs)) return 0;

    if (value_tag(lhs) != value_tag(rhs)) {
        return value_tag(lhs) - value_tag(rhs);
    }

    if (int_p(lhs) && int_p(rhs)) {
        return to_int64(lhs) - to_int64(rhs);
    }

    if (float_p(lhs) && float_p(rhs)) {
        return to_double(lhs) - to_double(rhs);
    }

    if (object_p(lhs) && object_p(rhs)) {
        if (to_object(lhs)->header.class != to_object(rhs)->header.class) {
            return string_compare_lexical(
                to_object(lhs)->header.class->name,
                to_object(rhs)->header.class->name);
        }

        object_compare_fn_t *compare_fn =
            to_object(lhs)->header.class->compare_fn;
        if (compare_fn) {
            return compare_fn(to_object(lhs), to_object(rhs));
        } else {
            who_printf("unhandled objects\n");
            printf("  lhs: "); print(lhs); newline();
            printf("  rhs: "); print(rhs); newline();
        }
    }

    who_printf("unhandled values\n");
    printf("  lhs: "); print(lhs); newline();
    printf("  rhs: "); print(rhs); newline();
    exit(1);
}

void
init_constant_values(void) {
    x_true = x_object(intern_hashtag("t"));
    x_false = x_object(intern_hashtag("f"));
    x_null = x_object(intern_hashtag("null"));
    x_void = x_object(intern_hashtag("void"));
}
