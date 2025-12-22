#pragma once

struct record_iter_t {
    struct hash_iter_t hash_iter;
};

record_iter_t *make_record_iter(const record_t *record);
void record_iter_init(record_iter_t *self, const record_t *record);
void record_iter_free(record_iter_t *self);

const hash_entry_t *record_iter_next_entry(record_iter_t *self);
void *record_iter_next_value(record_iter_t *self);
void *record_iter_next_key(record_iter_t *self);

array_t *record_entries(record_t *record);
array_t *record_values(record_t *record);
array_t *record_keys(record_t *record);
