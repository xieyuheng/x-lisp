#pragma once

struct mod_t {
    path_t *path;
    char *text;
    hash_t *definitions;
    // array_t *placeholders;
};

mod_t *make_mod(path_t *path, char *text);
void mod_free(mod_t *self);

definition_t *mod_lookup(mod_t *self, const char *name);
