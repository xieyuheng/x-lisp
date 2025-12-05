#pragma once

struct mod_t {
    path_t *path;
    char *text;
    hash_t *definitions;
};

mod_t *make_mod(path_t *path, char *text);
void mod_free(mod_t *self);
