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

record_t *
make_record_with(free_fn_t *free_fn) {
    record_t *self = make_record();
    record_put_free_fn(self, free_fn);
    return self;
}

record_t *
make_string_record(void) {
    return make_record_with((free_fn_t *) string_free);
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

bool
record_has(record_t *self, const char *key) {
    return hash_has(self->hash, key);
}

void *
record_get(record_t *self, const char *key) {
    return hash_get(self->hash, key);
}

bool
record_insert(record_t *self, const char *key, void *value) {
    return hash_insert(self->hash, string_copy(key), value);
}

void
record_insert_or_fail(record_t *self, const char *key, void *value) {
    hash_insert_or_fail(self->hash, string_copy(key), value);
}

void
record_put(record_t *self, const char *key, void *value) {
    hash_put(self->hash, string_copy(key), value);
}

bool
record_delete(record_t *self, const char *key) {
    return hash_delete(self->hash, key);
}

void *
record_first_value(record_t *self) {
    return hash_first_value(self->hash);
}

void *
record_next_value(record_t *self) {
    return hash_next_value(self->hash);
}

void *
record_first_key(record_t *self) {
    return hash_first_key(self->hash);
}

void *
record_next_key(record_t *self) {
    return hash_next_key(self->hash);
}
