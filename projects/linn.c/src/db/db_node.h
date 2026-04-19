#pragma once

struct db_node_t {
    value_t value;
    record_t *children;
};

db_node_t *make_db_node(value_t value);
void db_node_free(db_node_t *self);
