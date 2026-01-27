#include "index.h"

value_t x_void;

bool
void_p(value_t value) {
    return value == x_void;
}

value_t
x_void_p(value_t value) {
    return x_bool(void_p(value));
}
