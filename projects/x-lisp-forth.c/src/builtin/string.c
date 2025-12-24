#include "index.h"

value_t
x_string_p(value_t value) {
    return x_bool(xstring_p(value));
}

value_t
x_string_length(value_t string) {
    return x_int(xstring_length(to_xstring(string)));
}

value_t
x_string_empty_p(value_t string) {
    return x_bool(xstring_is_empty(to_xstring(string)));
}

value_t
x_string_append(value_t left, value_t right) {
    return x_object(xstring_append(to_xstring(left), to_xstring(right)));
}
