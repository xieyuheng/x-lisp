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
