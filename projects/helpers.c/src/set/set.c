#include "index.h"

set_t *
make_set(void) {
    set_t *self = new(set_t);
    self->hash = make_hash();
    return self;
}

void
set_free(set_t *self) {
    hash_free(self->hash);
    free(self);
}

void
set_put_hash_fn(set_t *self, hash_fn_t *hash_fn) {
    hash_put_hash_fn(self->hash, hash_fn);
}

void
set_put_free_fn(set_t *self, free_fn_t *free_fn) {
    // key is the same as value
    hash_put_key_free_fn(self->hash, free_fn);
}

void
set_put_equal_fn(set_t *self, equal_fn_t *equal_fn) {
    hash_put_key_equal_fn(self->hash, equal_fn);
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
    set_put_hash_fn(self, (hash_fn_t *) string_hash_code);
    set_put_free_fn(self, (free_fn_t *) string_free);
    set_put_equal_fn(self, (equal_fn_t *) string_equal);
    return self;
}

size_t
set_size(const set_t *self) {
    return hash_length(self->hash);
}

bool
set_is_empty(const set_t *self) {
    return hash_is_empty(self->hash);
}

bool
set_add(set_t *self, void *value) {
    return hash_insert(self->hash, value, value);
}

void
set_put(set_t *self, void *value) {
    hash_put(self->hash, value, value);
    return;
}

bool
set_has(set_t *self, void *value) {
    return hash_has(self->hash, value);
}

bool
set_delete(set_t *self, void *value) {
    return hash_delete(self->hash, value);
}
