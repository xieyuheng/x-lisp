#pragma once

struct hash_iter_t {
    const hash_t *hash;
    const hash_entry_t *entry;
};

hash_iter_t *make_hash_iter(const hash_t *hash);
void hash_iter_init(hash_iter_t *self, const hash_t *hash);
void hash_iter_free(hash_iter_t *self);

const hash_entry_t *hash_iter_next_entry(hash_iter_t *self);
void *hash_iter_next_value(hash_iter_t *self);
void *hash_iter_next_key(hash_iter_t *self);

array_t *hash_entries(hash_t *hash);
array_t *hash_values(hash_t *hash);
array_t *hash_keys(hash_t *hash);
