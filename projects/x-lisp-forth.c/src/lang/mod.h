#pragma once

struct mod_t {
    path_t *path;
    record_t *definitions;
};

mod_t *make_mod(path_t *path);
void mod_free(mod_t *self);

void mod_define(mod_t *self, const char *name, definition_t *definition);
definition_t *mod_lookup(mod_t *self, const char *name);
definition_t *mod_lookup_or_placeholder(mod_t *self, const char *name);

void mod_run(mod_t *mod);
