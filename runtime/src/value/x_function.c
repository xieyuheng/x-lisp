#include "index.h"

value_t
x_function(void *pointer) {
    return (value_t) ((uint64_t) pointer | X_FUNCTION);
}
