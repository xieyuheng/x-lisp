#include "index.h"

hash_entry_t *
make_hash_entry(hash_t *hash, void *key, void *value) {
    hash_entry_t *self = new(hash_entry_t);
    self->key = key;
    self->value = value;
    self->index = hash_key_index(hash, key);
    return self;
}

void
hash_entry_free(hash_entry_t *self) {
    free(self);
}
