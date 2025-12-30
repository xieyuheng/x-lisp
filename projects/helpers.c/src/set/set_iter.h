#pragma once

struct set_iter_t {
    struct hash_iter_t hash_iter;
};

set_iter_t *make_set_iter(const set_t *set);
void set_iter_init(set_iter_t *self, const set_t *set);
void set_iter_free(set_iter_t *self);

void *set_iter_next(set_iter_t *self);
const hash_entry_t *set_iter_next_entry(set_iter_t *self);


array_t *set_values(const set_t *set);
