#pragma once

struct db_t {
    db_node_t *root;
};

db_t *make_db(void);
void db_free(db_t *self);
