#include "index.h"

value_t
x_function(void *pointer) {
    return (value_t) ((uint64_t) pointer | X_FUNCTION);
}

bool
function_p(value_t value) {
    return value_tag(value) == X_FUNCTION;
}
