#pragma once

struct mod_t {
  path_t *path;
  record_t *definitions;
  set_t *test_names;
};

mod_t *make_mod(path_t *path);
void mod_free(mod_t *self);

void mod_define(mod_t *self, const char *name, definition_t *definition);
definition_t *mod_lookup(mod_t *self, const char *name);
definition_t *mod_lookup_or_fail(mod_t *self, const char *name);
