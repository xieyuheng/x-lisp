#include "index.h"

value_t
x_make_record(void) {
    return x_object(make_xrecord());
}

value_t
x_any_record_p(value_t value) {
    return x_bool(xrecord_p(value));
}

value_t
x_record_copy(value_t record) {
    return x_object(xrecord_copy(to_xrecord(record)));
}

value_t
x_record_length(value_t record) {
    return x_int(record_length(to_xrecord(record)->attributes));
}

value_t
x_record_empty_p(value_t record) {
    return x_bool(record_is_empty(to_xrecord(record)->attributes));
}

value_t
x_record_get(value_t key, value_t record) {
    return xrecord_get(to_xrecord(record), keyword_string(to_keyword(key)));
}

value_t
x_record_has_p(value_t key, value_t record) {
    return x_bool(xrecord_has(to_xrecord(record), keyword_string(to_keyword(key))));
}

value_t
x_record_put_mut(value_t key, value_t value, value_t record) {
    xrecord_put(to_xrecord(record), keyword_string(to_keyword(key)), value);
    return record;
}

value_t
x_record_put(value_t key, value_t value, value_t record) {
    return x_record_put_mut(key, value, x_record_copy(record));
}

value_t
x_record_delete_mut(value_t key, value_t record) {
    xrecord_delete(to_xrecord(record), keyword_string(to_keyword(key)));
    return record;
}

value_t
x_record_delete(value_t key, value_t record) {
    return x_record_delete_mut(key, x_record_copy(record));
}

value_t
x_record_append(value_t left, value_t right) {
    xrecord_t *new_xrecord = xrecord_copy(to_xrecord(left));

    record_iter_t iter;
    record_iter_init(&iter, to_xrecord(right)->attributes);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        value_t value = (value_t) entry->value;
        xrecord_put(new_xrecord, entry->key, value);
        entry = record_iter_next_entry(&iter);
    }

    return x_object(new_xrecord);
}

value_t
x_record_keys(value_t record) {
    xlist_t *keys = make_xlist();

    record_iter_t iter;
    record_iter_init(&iter, to_xrecord(record)->attributes);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        value_t key = x_object(intern_keyword(entry->key));
        xlist_push(keys, key);
        entry = record_iter_next_entry(&iter);
    }

    return x_object(keys);
}

value_t
x_record_values(value_t record) {
    xlist_t *values = make_xlist();

    record_iter_t iter;
    record_iter_init(&iter, to_xrecord(record)->attributes);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        value_t value = (value_t) entry->value;
        xlist_push(values, value);
        entry = record_iter_next_entry(&iter);
    }

    return x_object(values);
}

value_t
x_record_entries(value_t record) {
    xlist_t *entries = make_xlist();

    record_iter_t iter;
    record_iter_init(&iter, to_xrecord(record)->attributes);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        value_t key = x_object(intern_keyword(entry->key));
        value_t value = (value_t) entry->value;
        xlist_t *pair = make_xlist();
        xlist_push(pair, key);
        xlist_push(pair, value);
        xlist_push(entries, x_object(pair));
        entry = record_iter_next_entry(&iter);
    }

    return x_object(entries);
}
