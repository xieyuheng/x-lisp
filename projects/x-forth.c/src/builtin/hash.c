#include "index.h"

value_t
x_make_hash(void) {
    return x_object(make_xhash());
}

value_t
x_any_hash_p(value_t value) {
    return x_bool(xhash_p(value));
}

value_t
x_hash_copy(value_t hash) {
    return x_object(xhash_copy(to_xhash(hash)));
}

value_t
x_hash_length(value_t hash) {
    return x_int(xhash_length(to_xhash(hash)));
}

value_t
x_hash_empty_p(value_t hash) {
    return x_bool(xhash_empty_p(to_xhash(hash)));
}

value_t
x_hash_get(value_t key, value_t hash) {
    return xhash_get(to_xhash(hash), key);
}

value_t
x_hash_has_p(value_t key, value_t hash) {
    return x_bool(!equal_p(x_hash_get(key, hash), x_null));
}

value_t
x_hash_put_mut(value_t key, value_t value, value_t hash) {
    xhash_put(to_xhash(hash), key, value);
    return hash;
}

value_t
x_hash_put(value_t key, value_t value, value_t hash) {
    return x_hash_put_mut(key, value, x_hash_copy(hash));
}

value_t
x_hash_delete_mut(value_t key, value_t hash) {
    xhash_delete(to_xhash(hash), key);
    return hash;
}

value_t
x_hash_delete(value_t key, value_t hash) {
    return x_hash_delete_mut(key, x_hash_copy(hash));
}

value_t
x_hash_keys(value_t hash) {
    tael_t *keys = make_tael();

    hash_iter_t iter;
    hash_iter_init(&iter, to_xhash(hash)->hash);
    const hash_entry_t *entry = hash_iter_next_entry(&iter);
    while (entry) {
        tael_push_element(keys, (value_t) entry->key);
        entry = hash_iter_next_entry(&iter);
    }

    return x_object(keys);
}

value_t
x_hash_values(value_t hash) {
    tael_t *keys = make_tael();

    hash_iter_t iter;
    hash_iter_init(&iter, to_xhash(hash)->hash);
    const hash_entry_t *entry = hash_iter_next_entry(&iter);
    while (entry) {
        tael_push_element(keys, (value_t) entry->value);
        entry = hash_iter_next_entry(&iter);
    }

    return x_object(keys);
}

value_t
x_hash_entries(value_t hash) {
    tael_t *entries = make_tael();

    hash_iter_t iter;
    hash_iter_init(&iter, to_xhash(hash)->hash);
    const hash_entry_t *entry = hash_iter_next_entry(&iter);
    while (entry) {
        value_t key = (value_t) entry->key;
        value_t value = (value_t) entry->value;
        tael_t *pair = make_tael();
        tael_push_element(pair, key);
        tael_push_element(pair, value);
        tael_push_element(entries, x_object(pair));
        entry = hash_iter_next_entry(&iter);
    }

    return x_object(entries);
}
