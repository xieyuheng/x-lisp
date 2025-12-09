#include "index.h"

struct record_t {
    hash_t *hash;
};

record_t *
make_record(void) {
    record_t *self = new(record_t);
    self->hash = make_hash();
    hash_put_key_free_fn(self->hash, (free_fn_t *) string_free);
    hash_put_key_equal_fn(self->hash, (equal_fn_t *) string_equal);
    hash_put_hash_fn(self->hash, (hash_fn_t *) string_bernstein_hash);
    return self;
}

void
record_purge(record_t *self) {
    hash_purge(self->hash);
}

void
record_free(record_t *self) {
    hash_free(self->hash);
    free(self);
}

void
record_put_free_fn(record_t *self, free_fn_t *free_fn) {
    hash_put_value_free_fn(self->hash, free_fn);
}

size_t
record_length(const record_t *self) {
    return hash_length(self->hash);
}
