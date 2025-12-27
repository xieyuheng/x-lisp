#include "index.h"

// int64_t but truncate the lower 3 bits

value_t
x_int(int64_t target) {
    return (value_t) ((target << 3) | X_INT);
}

bool
int_p(value_t value) {
    return value_tag(value) == X_INT;
}

int64_t
to_int64(value_t value) {
    assert(int_p(value));
    return ((int64_t) value) >> 3;
}

value_t
x_int_p(value_t value) {
    return x_bool(int_p(value));
}

value_t
x_ineg(value_t x) {
    return x_int(-to_int64(x));
}

value_t
x_iadd(value_t x, value_t y) {
    return x_int(to_int64(x) + to_int64(y));
}

value_t
x_isub(value_t x, value_t y) {
    return x_int(to_int64(x) - to_int64(y));
}

value_t
x_imul(value_t x, value_t y) {
    return x_int(to_int64(x) * to_int64(y));
}

value_t
x_idiv(value_t x, value_t y) {
    return x_int(to_int64(x) / to_int64(y));
}

value_t
x_imod(value_t x, value_t y) {
    return x_int(to_int64(x) % to_int64(y));
}

value_t
x_int_max(value_t x, value_t y) {
    return x_int(int_max(to_int64(x), to_int64(y)));
}

value_t
x_int_min(value_t x, value_t y) {
    return x_int(int_min(to_int64(x), to_int64(y)));
}

value_t
x_int_greater_p(value_t x, value_t y) {
    return x_bool(to_int64(x) > to_int64(y));
}

value_t
x_int_less_p(value_t x, value_t y) {
    return x_bool(to_int64(x) < to_int64(y));
}

value_t
x_int_greater_or_equal_p(value_t x, value_t y) {
    return x_bool(to_int64(x) >= to_int64(y));
}

value_t
x_int_less_or_equal_p(value_t x, value_t y) {
    return x_bool(to_int64(x) <= to_int64(y));
}

value_t
x_int_positive_p(value_t x) {
    return x_bool(to_int64(x) > 0);
}

value_t
x_int_non_negative_p(value_t x) {
    return x_bool(to_int64(x) >= 0);
}

value_t
x_int_non_zero_p(value_t x) {
    return x_bool(to_int64(x) != 0);
}

value_t
x_int_compare_ascending(value_t x, value_t y) {
    if (to_int64(x) < to_int64(y)) {
        return x_int(-1);
    } else if (to_int64(x) > to_int64(y)) {
        return x_int(1);
    } else {
        return x_int(0);
    }
}

value_t
x_int_compare_descending(value_t x, value_t y) {
    if (to_int64(x) < to_int64(y)) {
        return x_int(1);
    } else if (to_int64(x) > to_int64(y)) {
        return x_int(-1);
    } else {
        return x_int(0);
    }
}

value_t
x_int_to_float(value_t x) {
    if (!x_int_p(x)) {
        who_printf("type mismatch\n");
        exit(1);
    }

    return x_float((double) to_int64(x));
}
