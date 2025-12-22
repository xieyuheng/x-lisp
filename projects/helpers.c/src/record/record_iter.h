#pragma once

struct record_iter_t {
    struct hash_iter_t hash_iter;
};

record_iter_t *make_record_iter(const record_t *record);
void record_iter_init(record_iter_t *self, const record_t *record);
void record_iter_free(record_iter_t *self);
