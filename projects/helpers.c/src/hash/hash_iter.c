#include "index.h"

hash_iter_t *
make_hash_iter(const hash_t *hash) {
    hash_iter_t *self = new(hash_iter_t);
    hash_iter_init(self, hash);
    return self;
}

void
hash_iter_init(hash_iter_t *self, const hash_t *hash) {
    self->hash = hash;
    self->entry = hash_first_entry(hash);
}

void
hash_iter_free(hash_iter_t *self) {
    free(self);
}

const hash_entry_t *
hash_iter_next_entry(hash_iter_t *self) {
    if (self->entry) {
        const hash_entry_t *entry = self->entry;
        self->entry = self->entry->next;
        return entry;
    } else {
        return NULL;
    }
}

void *
hash_iter_next_value(hash_iter_t *self) {
    const hash_entry_t *entry = hash_iter_next_entry(self);
    if (entry) {
        return entry->value;
    } else {
        return NULL;
    }
}

void *
hash_iter_next_key(hash_iter_t *self) {
    const hash_entry_t *entry = hash_iter_next_entry(self);
    if (entry) {
        return entry->key;
    } else {
        return NULL;
    }
}

array_t *
hash_entries(const hash_t *hash) {
    array_t *entries = make_array();
    hash_iter_t iter;
    hash_iter_init(&iter, hash);
    const hash_entry_t *entry = hash_iter_next_entry(&iter);
    while (entry) {
        array_push(entries, (void *) entry);
        entry = hash_iter_next_entry(&iter);
    }

    return entries;
}

array_t *
hash_values(const hash_t *hash) {
    array_t *values = make_array();
    hash_iter_t iter;
    hash_iter_init(&iter, hash);
    void *value = hash_iter_next_value(&iter);
    while (value) {
        array_push(values, value);
        value = hash_iter_next_value(&iter);
    }

    return values;
}

array_t *
hash_keys(const hash_t *hash) {
    array_t *keys = make_array();
    hash_iter_t iter;
    hash_iter_init(&iter, hash);
    void *key = hash_iter_next_key(&iter);
    while (key) {
        array_push(keys, key);
        key = hash_iter_next_key(&iter);
    }

    return keys;
}
