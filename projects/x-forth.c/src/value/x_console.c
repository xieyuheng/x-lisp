#include "index.h"

value_t
x_newline(void) {
    printf("\n");
    return x_void;
}

value_t
x_print(value_t x) {
    value_print(x);
    return x_void;
}

value_t
x_println_non_void(value_t x) {
    if (x != x_void) {
        value_print(x);
    }

    return x_void;
}
