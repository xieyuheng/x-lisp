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
