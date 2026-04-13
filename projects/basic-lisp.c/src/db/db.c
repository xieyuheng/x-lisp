#include "index.h"

struct db_t {
    array_t *datoms;
};

db_t *
make_db(void) {
    db_t *self = new(db_t);
    self->datoms = make_array_with((free_fn_t *) datom_free);
    return self;
}

void
db_free(db_t *self) {
    array_free(self->datoms);
    free(self);
}
