#pragma once

struct db_t {
  db_node_t *root;
};

db_t *make_db(void);
void db_free(db_t *self);

db_node_t *db_ensure_node(db_t *db, const char *key);
void db_put(db_t *db, const char *key, value_t value);
db_node_t *db_get_node(db_t *db, const char *key);
value_t db_get(db_t *db, const char *key);
bool db_has(db_t *db, const char *key);
void db_delete_recursive(db_t *db, const char *key);

void db_put_attribute(db_t *db, const char *prefix, const char *name, value_t value);
value_t db_get_attribute(db_t *db, const char *prefix, const char *name);
bool db_has_attribute(db_t *db, const char *prefix, const char *name);
