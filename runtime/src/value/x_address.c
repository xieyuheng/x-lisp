#include "index.h"

value_t
x_address(void *pointer) {
    return (value_t) ((uint64_t) pointer | X_ADDRESS);
}

bool
address_p(value_t value) {
    return value_tag(value) == X_ADDRESS;
}
