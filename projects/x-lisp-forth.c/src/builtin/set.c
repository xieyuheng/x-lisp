#include "index.h"

value_t
x_make_set(void) {
    return x_object(make_xset());
}

value_t
x_any_set_p(value_t value) {
    return x_bool(xset_p(value));
}

value_t
x_set_copy(value_t set) {
    return x_object(xset_copy(to_xset(set)));
}

value_t
x_set_size(value_t set) {
    return x_int(xset_size(to_xset(set)));
}

value_t
x_set_empty_p(value_t set) {
    return x_bool(xset_empty_p(to_xset(set)));
}

value_t
x_set_member_p(value_t value, value_t set) {
    return x_bool(xset_member_p(to_xset(set), value));
}

value_t
x_set_add_mut(value_t value, value_t set) {
    xset_add(to_xset(set), value);
    return set;
}

value_t
x_set_add(value_t value, value_t set) {
    return x_set_add_mut(value, x_set_copy(set));
}

value_t
x_set_delete_mut(value_t value, value_t set) {
    xset_delete(to_xset(set), value);
    return set;
}

value_t
x_set_delete(value_t value, value_t set) {
    return x_set_delete_mut(value, x_set_copy(set));
}
