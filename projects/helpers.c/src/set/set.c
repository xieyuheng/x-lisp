#include "index.h"

struct set_t {
    hash_t *value_hash;
};

set_t *
make_set(void) {
    set_t *self = new(set_t);
    self->value_hash = make_hash();
    return self;
}

void
set_free(set_t *self) {
    hash_free(self->value_hash);
    free(self);
}

void
set_put_hash_fn(set_t *self, hash_fn_t *hash_fn) {
    hash_put_hash_fn(self->value_hash, hash_fn);
}

void
set_put_free_fn(set_t *self, free_fn_t *free_fn) {
    // key is the same as value
    hash_put_key_free_fn(self->value_hash, free_fn);
}

void
set_put_equal_fn(set_t *self, equal_fn_t *equal_fn) {
    hash_put_key_equal_fn(self->value_hash, equal_fn);
}

set_t *
make_put_with(free_fn_t *free_fn) {
    set_t *self = make_set();
    set_put_free_fn(self, free_fn);
    return self;
}

set_t *
make_string_set(void) {
    set_t *self = make_set();
    set_put_hash_fn(self, (hash_fn_t *) string_bernstein_hash);
    set_put_free_fn(self, (free_fn_t *) string_free);
    set_put_equal_fn(self, (equal_fn_t *) string_equal);
    return self;
}

size_t
set_length(const set_t *self) {
    return hash_length(self->value_hash);
}

bool
set_add(set_t *self, void *value) {
    return hash_insert(self->value_hash, value, value);
}

void
set_put(set_t *self, void *value) {
    hash_put(self->value_hash, value, value);
    return;
}

bool
set_has(set_t *self, void *value) {
    return hash_has(self->value_hash, value);
}

bool
set_delete(set_t *self, void *value) {
    return hash_delete(self->value_hash, value);
}
