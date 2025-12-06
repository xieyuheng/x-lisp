#pragma once

struct mod_t {
    path_t *path;
    hash_t *definitions;
    // array_t *placeholders;
};

mod_t *make_mod(path_t *path);
void mod_free(mod_t *self);

void mod_define(mod_t *self, const char *name, definition_t *definition);
definition_t *mod_lookup(mod_t *self, const char *name);
