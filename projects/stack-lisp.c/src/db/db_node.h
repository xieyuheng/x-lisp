#pragma once

struct db_node_t {
  char *name;
  db_node_t *parent;
  record_t *children;
  value_t value;
};

db_node_t *db_make_node(char *name, db_node_t *parent);
void db_node_free(db_node_t *self);
