#include "index.h"

value_t
x_make_record(void) {
    return x_object(make_tael());
}

value_t
x_anything_record_p(value_t value) {
    return x_bool(tael_p(value));
}

value_t
x_record_copy(value_t record) {
    return x_object(tael_copy_only_attributes(to_tael(record)));
}

value_t
x_record_length(value_t record) {
    return x_int(record_length(to_tael(record)->attributes));
}

value_t
x_record_empty_p(value_t record) {
    return x_bool(record_is_empty(to_tael(record)->attributes));
}

value_t
x_record_get(value_t key, value_t record) {
    return tael_get_attribute(to_tael(record), symbol_string(to_symbol(key)));
}

value_t
x_record_has_p(value_t key, value_t record) {
    return x_equal_p(x_record_get(key, record), x_null);
}

value_t
x_record_put_mut(value_t key, value_t value, value_t record) {
    tael_put_attribute(to_tael(record), symbol_string(to_symbol(key)), value);
    return record;
}

value_t
x_record_put(value_t key, value_t value, value_t record) {
    return x_record_put_mut(key, value, x_record_copy(record));
}

value_t
x_record_delete_mut(value_t key, value_t record) {
    tael_delete_attribute(to_tael(record), symbol_string(to_symbol(key)));
    return record;
}

value_t
x_record_delete(value_t key, value_t record) {
    return x_record_delete_mut(key, x_record_copy(record));
}

value_t
x_record_merge(value_t left, value_t right) {
    tael_t *new_tael = tael_copy_only_attributes(to_tael(left));
    record_iter_t iter;
    record_iter_init(&iter, to_tael(right)->attributes);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        value_t value = (value_t) entry->value;
        if (!null_p(value)) {
            tael_put_attribute(new_tael, entry->key, value);
        }

        entry = record_iter_next_entry(&iter);
    }

    return x_object(new_tael);
}
