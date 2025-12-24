#include "index.h"

value_t
x_anything_list_p(value_t value) {
    return x_bool(tael_p(value));
}

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
x_list_empty_p(value_t list) {
    return x_bool(array_is_empty(to_tael(list)->elements));
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

value_t
x_car(value_t list) {
    return (value_t) array_get(to_tael(list)->elements, 0);
}

value_t
x_cdr(value_t list) {
    list = x_list_copy(list);
    x_list_shift_mut(list);
    return list;
}

value_t
x_cons(value_t head, value_t tail) {
    return x_list_unshift_mut(head, x_list_copy(tail));
}

value_t
x_list_head(value_t list) {
    return x_car(list);
}

value_t
x_list_tail(value_t list) {
    return x_cdr(list);
}

value_t
x_list_init(value_t list) {
    list = x_list_copy(list);
    x_list_pop_mut(list);
    return list;
}

value_t
x_list_last(value_t list) {
    size_t length = array_length(to_tael(list)->elements);
    return (value_t) array_get(to_tael(list)->elements, length - 1);
}

value_t
x_list_reverse_mut(value_t list) {
    array_reverse(to_tael(list)->elements);
    return list;
}

value_t
x_list_reverse(value_t list) {
    return x_list_reverse_mut(x_list_copy(list));
}
