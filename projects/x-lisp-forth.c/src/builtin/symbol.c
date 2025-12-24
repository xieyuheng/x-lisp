#include "index.h"

value_t
x_symbol_p(value_t value) {
    return x_bool(symbol_p(value));
}

value_t
x_symbol_length(value_t symbol) {
    return x_int(symbol_length(to_symbol(symbol)));
}

// value_t
// x_symbol_to_string(value_t symbol) {
//     return x_object(symbol_is_empty(to_symbol(symbol)));
// }

// value_t
// x_symbol_append(value_t left, value_t right) {
//     return x_object(symbol_append(to_symbol(left), to_symbol(right)));
// }
