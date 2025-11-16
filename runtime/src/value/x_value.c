#include "index.h"

value_t
x_identity(value_t x) {
    return x;
}

value_t
x_anything_p(value_t x) {
    (void) x;
    return x_bool(true);
}

value_t
x_same_p(value_t x, value_t y) {
    // TODO handle immutable object value
    return x_bool(x == y);
}

value_t
x_equal_p(value_t x, value_t y) {
    return x_same_p(x, y);
}
