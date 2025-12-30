#include "index.h"

value_t
x_make_hash(void) {
    return x_object(make_hash());
}
