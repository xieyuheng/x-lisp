#pragma once

struct list_node_t {
    list_node_t *prev;
    list_node_t *next;
    void *value;
};

list_node_t *make_list_node(void *value);
void list_node_free(list_node_t *self);
