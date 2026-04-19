#include "index.h"

struct db_node_t {
    value_t value;
    record_t *children;
};
