#include "index.h"
#include "node.h"

struct list_iter_t {
    const list_t *list;
    node_t *cursor;
};
