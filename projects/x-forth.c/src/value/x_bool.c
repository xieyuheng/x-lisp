#include "index.h"

value_t x_true =
    ((value_t)
     (X_LITTLE
      | (((uint64_t) '#') << (7 * 8))
      | (((uint64_t) 't') << (6 * 8))));

value_t x_false =
    ((value_t)
     (X_LITTLE
      | (((uint64_t) '#') << (7 * 8))
      | (((uint64_t) 'f') << (6 * 8))));

value_t
x_bool(bool target) {
    return target ? x_true : x_false;
}

bool
bool_p(value_t value) {
    return value == x_true || value == x_false;
}

bool
to_bool(value_t value) {
    assert(bool_p(value));
    return value == x_true;
}

value_t
x_bool_p(value_t value) {
    return x_bool(bool_p(value));
}

value_t x_not(value_t x) {
    return x_bool(!to_bool(x));
}
