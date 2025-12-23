#include "index.h"

value_t
x_make_list(void) {
    return x_object(make_tael());
}

value_t
x_list_copy(value_t value) {
    return x_object(tael_copy_only_elements(to_tael(value)));
}

value_t
x_list_length(value_t value) {
    return x_int(array_length(to_tael(value)->elements));
}
