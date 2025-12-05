#include "index.h"

struct mod_t {
    path_t *path;
    char *text;
    hash_t *definitions;
};

mod_t *
make_mod(path_t *path, char *text) {
    mod_t *self = new(mod_t);
    self->path = path;
    self->text = text;
    self->definitions = make_hash_with_string_keys();
    return self;
}
