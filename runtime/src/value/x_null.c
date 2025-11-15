#include "index.h"

bool
null_p(value_t value) {
    return value == x_null;
}

value_t
x_null_p(value_t value) {
    return x_bool(null_p(value));
}
