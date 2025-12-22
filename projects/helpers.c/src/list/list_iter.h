#pragma once

struct list_iter_t {
    const list_t *list;
    const list_node_t *node;
};

list_iter_t *make_list_iter(const list_t *list);
void list_iter_init(list_iter_t *self, const list_t *list);
void list_iter_free(list_iter_t *self);

void *list_iter_next(list_iter_t *self);
