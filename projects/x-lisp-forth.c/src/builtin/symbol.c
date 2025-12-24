#include "index.h"

value_t
x_symbol_p(value_t value) {
    return x_bool(symbol_p(value));
}

value_t
x_symbol_length(value_t symbol) {
    return x_int(symbol_length(to_symbol(symbol)));
}

value_t
x_symbol_to_string(value_t symbol) {
    return x_object(make_xstring(string_copy(symbol_string(to_symbol(symbol)))));
}

value_t
x_symbol_append(value_t left, value_t right) {
    char *string = string_append(
        symbol_string(to_symbol(left)),
        symbol_string(to_symbol(right)));
    symbol_t *symbol = intern_symbol(string);
    string_free(string);
    return x_symbol(symbol);
}
