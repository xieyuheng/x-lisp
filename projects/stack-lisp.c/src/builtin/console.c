#include "index.h"

value_t
x_newline(void) {
    newline();
    return x_void;
}

value_t
x_write(value_t x) {
    string_print(to_xstring(x)->string);
    return x_void;
}

value_t
x_print(value_t x) {
    print(x);
    return x_void;
}

value_t
x_println(value_t x) {
    print(x);
    newline();
    return x_void;
}
