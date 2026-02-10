#include "index.h"

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

value_t
x_total_compare(value_t lhs, value_t rhs) {
    return x_int(value_total_compare(lhs, rhs));
}
