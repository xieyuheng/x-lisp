#include "index.h"

record_iter_t *
make_record_iter(const record_t *record) {
    record_iter_t *self = new(record_iter_t);
    record_iter_init(self, record);
    return self;
}

void
record_iter_init(record_iter_t *self, const record_t *record) {
    hash_iter_init(&self->hash_iter, record->hash);
}

void
record_iter_free(record_iter_t *self) {
    free(self);
}

const hash_entry_t *
record_iter_next_entry(record_iter_t *self) {
    return hash_iter_next_entry(&self->hash_iter);
}

void *
record_iter_next_value(record_iter_t *self) {
    return hash_iter_next_value(&self->hash_iter);
}

void *
record_iter_next_key(record_iter_t *self) {
    return hash_iter_next_key(&self->hash_iter);
}

array_t *
record_entries(const record_t *record) {
    return hash_entries(record->hash);
}

array_t *
record_values(const record_t *record) {
    return hash_values(record->hash);
}

array_t *
record_keys(const record_t *record) {
    return hash_keys(record->hash);
}
