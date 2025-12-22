#include "index.h"
#include "node.h"

struct list_iter_t {
    const list_t *list;
    node_t *cursor;
};

list_iter_t *
make_list_iter(const list_t *list) {
    list_iter_t *self = new(list_iter_t);
    list_iter_init(self, list);
    return self;
}

void
list_iter_init(list_iter_t *self, const list_t *list) {
    self->list = list;
    // self->cursor = list_first(list);
    self->cursor = list_first((list_t *) list);
}

void
list_iter_free(list_iter_t *self) {
    free(self);
}
