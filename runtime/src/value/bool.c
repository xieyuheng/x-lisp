#include "index.h"

value_t
x_bool(bool target) {
    return target ? x_true : x_false;
}

bool
x_bool_p(value_t value) {
    return value == x_true || value == x_false;
}

bool
to_bool(value_t value) {
    assert(x_bool_p(value));
    return value == x_true;
}

value_t x_not(value_t x) {
    return x_bool(!to_bool(x));
}
