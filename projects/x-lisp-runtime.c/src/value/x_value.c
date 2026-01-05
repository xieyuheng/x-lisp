#include "index.h"

bool
same_p(value_t lhs, value_t rhs) {
    if (object_p(lhs) &&
        object_p(lhs) &&
        to_object(lhs)->spec == to_object(rhs)->spec &&
        to_object(lhs)->spec->same_fn != NULL)
    {
        return to_object(lhs)->spec->same_fn(to_object(lhs), to_object(rhs));
    }

    return lhs == rhs;
}

bool
equal_p(value_t lhs, value_t rhs) {
    if (object_p(lhs) &&
        object_p(lhs) &&
        to_object(lhs)->spec == to_object(rhs)->spec &&
        to_object(lhs)->spec->equal_fn != NULL)
    {
        return to_object(lhs)->spec->equal_fn(to_object(lhs), to_object(rhs));
    }

    return same_p(lhs, rhs);
}

value_t
x_identity(value_t x) {
    return x;
}

value_t
x_any_p(value_t x) {
    (void) x;
    return x_bool(true);
}

value_t
x_same_p(value_t lhs, value_t rhs) {
    if (object_p(lhs) &&
        object_p(lhs) &&
        to_object(lhs)->spec == to_object(rhs)->spec &&
        to_object(lhs)->spec->same_fn != NULL)
    {
        return x_bool(to_object(lhs)->spec->same_fn(to_object(lhs), to_object(rhs)));
    }

    return x_bool(lhs == rhs);
}

value_t
x_equal_p(value_t lhs, value_t rhs) {
    if (object_p(lhs) &&
        object_p(lhs) &&
        to_object(lhs)->spec == to_object(rhs)->spec &&
        to_object(lhs)->spec->equal_fn != NULL)
    {
        return x_bool(to_object(lhs)->spec->equal_fn(to_object(lhs), to_object(rhs)));
    }

    return x_same_p(lhs, rhs);
}
