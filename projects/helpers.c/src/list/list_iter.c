#include "index.h"

struct list_iter_t {
    const list_t *list;
    list_node_t *cursor;
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
    self->cursor = list->first;
}

void
list_iter_free(list_iter_t *self) {
    free(self);
}

void *
list_iter_next(list_iter_t *self) {
    if (self->cursor) {
        void *value = self->cursor->value;
        self->cursor = self->cursor->next;
        return value;
    } else {
        return NULL;
    }
}
