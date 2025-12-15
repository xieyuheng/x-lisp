#include "index.h"

mod_t *
make_mod(path_t *path) {
    mod_t *self = new(mod_t);
    self->path = path;
    self->definitions = make_record_with((free_fn_t *) definition_free);
    return self;
}

void
mod_free(mod_t *self) {
    path_free(self->path);
    record_free(self->definitions);
    free(self);
}

void
mod_define(mod_t *self, const char *name, definition_t *definition) {
    record_insert_or_fail(self->definitions, name, definition);
}

definition_t *
mod_lookup(mod_t *self, const char *name) {
    return record_get(self->definitions, name);
}

definition_t *
mod_lookup_or_placeholder(mod_t *self, const char *name) {
    definition_t *definition = mod_lookup(self, name);
    if (definition) return definition;

    return define_placeholder(self, name);
}
