#include "index.h"

db_node_t *db_make_node(char *name, db_node_t *parent) {
  db_node_t *self = new(db_node_t);
  self->name = name;
  self->parent = parent;
  self->value = x_void;
  self->children = make_record_with((free_fn_t *) db_node_free);
  return self;
}

void db_node_free(db_node_t *self) {
  if (self->name) string_free(self->name);
  record_free(self->children);
  free(self);
}
