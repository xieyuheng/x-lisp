#include "index.h"

set_iter_t *
make_set_iter(const set_t *set) {
    set_iter_t *self = new(set_iter_t);
    set_iter_init(self, set);
    return self;
}

void
set_iter_init(set_iter_t *self, const set_t *set) {
    hash_iter_init(&self->hash_iter, set->hash);
}

void
set_iter_free(set_iter_t *self) {
    free(self);
}

// void *
// set_iter_next(set_iter_t *self) {
//     return hash_iter_next_value(&self->hash_iter);
// }

// array_t *
// set_values(set_t *set) {
//     return hash_values(set->hash);
// }
