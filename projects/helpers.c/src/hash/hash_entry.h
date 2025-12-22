#pragma once

struct hash_entry_t {
    size_t index;
    void *key;
    void *value;

    // double-linked list to record insertion order.
    hash_entry_t *prev;
    hash_entry_t *next;

    // single-linked list to resolve hash collision.
    hash_entry_t *link;
};

hash_entry_t *make_hash_entry(hash_t *hash, void *key, void *value);
void hash_entry_free(hash_entry_t *self);
