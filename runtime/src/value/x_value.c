#include "index.h"

value_t
x_identity(value_t x) {
    return x;
}

value_t
x_anything_p(value_t x) {
    (void) x;
    return x_bool(true);
}

value_t
x_same_p(value_t x, value_t y) {
    if (x_object_p(x) &&
        x_object_p(x) &&
        to_object(x)->spec == to_object(y)->spec &&
        to_object(x)->spec->same_fn != NULL)
    {
        return x_bool(to_object(x)->spec->same_fn(to_object(x), to_object(y)));
    }

    return x_bool(x == y);
}

value_t
x_equal_p(value_t x, value_t y) {
    if (x_object_p(x) &&
        x_object_p(x) &&
        to_object(x)->spec == to_object(y)->spec &&
        to_object(x)->spec->equal_fn != NULL)
    {
        return x_bool(to_object(x)->spec->equal_fn(to_object(x), to_object(y)));
    }

    return x_same_p(x, y);
}
