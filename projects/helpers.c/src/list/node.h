#pragma once

typedef struct node_t node_t;

struct node_t {
    node_t *prev;
    node_t *next;
    void *value;
};
