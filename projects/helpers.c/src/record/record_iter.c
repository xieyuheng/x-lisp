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
