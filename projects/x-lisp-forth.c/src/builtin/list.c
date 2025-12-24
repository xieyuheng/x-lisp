#include "index.h"

value_t
x_make_list(void) {
    return x_object(make_tael());
}

value_t
x_list_copy(value_t list) {
    return x_object(tael_copy_only_elements(to_tael(list)));
}

value_t
x_list_length(value_t list) {
    return x_int(array_length(to_tael(list)->elements));
}

value_t
x_list_pop_mut(value_t list) {
    return tael_pop_element(to_tael(list));
}

value_t
x_list_push_mut(value_t value, value_t list) {
    tael_push_element(to_tael(list), value);
    return list;
}

value_t
x_list_shift_mut(value_t list) {
    return tael_shift_element(to_tael(list));
}

value_t
x_list_unshift_mut(value_t value, value_t list) {
    tael_unshift_element(to_tael(list), value);
    return list;
}

value_t
x_list_get(value_t index, value_t list) {
    return tael_get_element(to_tael(list), to_int64(index));
}

value_t
x_list_put_mut(value_t index, value_t value, value_t list) {
    tael_put_element(to_tael(list), to_int64(index), value);
    return list;
}
