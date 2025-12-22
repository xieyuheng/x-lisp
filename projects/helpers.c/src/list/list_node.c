#include "index.h"

list_node_t *
make_list_node(void *value) {
    list_node_t *self = new(list_node_t);
    self->value = value;
    return self;
}

void
list_node_free(list_node_t *self) {
    free(self);
}
