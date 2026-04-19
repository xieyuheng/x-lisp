#include "index.h"

db_node_t *
db_make_node(value_t value) {
    db_node_t *self = new(db_node_t);
    self->value = value;
    self->children = make_record_with((free_fn_t *) db_node_free);
    return self;
}

void
db_node_free(db_node_t *self) {
    record_free(self->children);
    free(self);
}
