#pragma once

struct hash_iter_t {
    const hash_t *hash;
    const hash_entry_t *entry;
};

hash_iter_t *make_hash_iter(const hash_t *hash);
void hash_iter_init(hash_iter_t *self, const hash_t *hash);
void hash_iter_free(hash_iter_t *self);

const hash_entry_t *hash_iter_next(hash_iter_t *self);
void *hash_iter_next_value(hash_iter_t *self);
void *hash_iter_next_key(hash_iter_t *self);
