#include "index.h"

db_t *
make_db(void) {
    db_t *self = new(db_t);
    self->root = db_make_node(x_void);
    return self;
}

void
db_free(db_t *self) {
    db_node_free(self->root);
    free(self);
}
