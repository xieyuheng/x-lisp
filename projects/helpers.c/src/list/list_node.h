#pragma once

typedef struct list_node_t list_node_t;

struct list_node_t {
    list_node_t *prev;
    list_node_t *next;
    void *value;
};
