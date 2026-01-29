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

value_t
x_set_clear_mut(value_t set) {
    xset_clear(to_xset(set));
    return set;
}

value_t
x_set_union(value_t lhs, value_t rhs) {
    return x_object(xset_union(to_xset(lhs), to_xset(rhs)));
}

value_t
x_set_inter(value_t lhs, value_t rhs) {
    return x_object(xset_inter(to_xset(lhs), to_xset(rhs)));
}

value_t
x_set_difference(value_t lhs, value_t rhs) {
    return x_object(xset_difference(to_xset(lhs), to_xset(rhs)));
}

value_t
x_set_subset_p(value_t subset, value_t set) {
    return x_bool(xset_subset_p(to_xset(subset), to_xset(set)));
}

value_t
x_set_disjoint_p(value_t lhs, value_t rhs) {
    return x_bool(xset_disjoint_p(to_xset(lhs), to_xset(rhs)));
}

value_t
x_set_to_list(value_t set) {
    tael_t *tael = make_tael();
    set_iter_t iter;
    set_iter_init(&iter, to_xset(set)->set);
    const hash_entry_t *entry = set_iter_next_entry(&iter);
    while (entry) {
        tael_push_element(tael, (value_t) entry->value);
        entry = set_iter_next_entry(&iter);
    }

    return x_object(tael);
}
