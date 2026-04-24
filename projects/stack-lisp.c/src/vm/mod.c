#include "index.h"

mod_t *make_mod(path_t *path) {
  mod_t *self = new(mod_t);
  self->path = path;
  self->definitions = make_record_with((free_fn_t *) definition_free);
  self->db = make_db();
  return self;
}

void mod_free(mod_t *self) {
  path_free(self->path);
  record_free(self->definitions);
  db_free(self->db);
  free(self);
}

void mod_define(mod_t *self, const char *name, definition_t *definition) {
  definition_t *found = record_get(self->definitions, name);
  if (found) {
    who_printf("can not redefine name: %s\n", name);
    exit(1);
  }

  record_put(self->definitions, name, definition);
}

definition_t *mod_lookup(mod_t *self, const char *name) {
  return record_get(self->definitions, name);
}
