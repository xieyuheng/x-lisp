#include "index.h"

value_t
x_string_p(value_t value) {
    return x_bool(xstring_p(value));
}
