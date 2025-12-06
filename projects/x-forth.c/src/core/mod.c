#include "index.h"

mod_t *
make_mod(path_t *path, char *text) {
    mod_t *self = new(mod_t);
    self->path = path;
    self->text = text;
    self->definitions = make_hash_with_string_keys();
    hash_put_value_free_fn(self->definitions, (free_fn_t *) definition_free);
    return self;
}

void
mod_free(mod_t *self) {
    path_free(self->path);
    string_free(self->text);
    hash_free(self->definitions);
    free(self);
}
