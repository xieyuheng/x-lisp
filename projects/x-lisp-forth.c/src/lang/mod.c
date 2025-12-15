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
    definition_t *found = record_get(self->definitions, name);
    if (found) {
        if (found->kind != PLACEHOLDER_DEFINITION) {
            who_printf("can not redefine name: %s\n", name);
            assert(false);

        }

        size_t length =
            array_length(found->placeholder_definition.placeholders);
        for (size_t i = 0; i < length; i ++) {
            placeholder_t *placeholder =
                array_get(found->placeholder_definition.placeholders, i);
            function_definition_put_definition(
                placeholder->definition,
                placeholder->code_index,
                definition);
        }
    }

    record_put(self->definitions, name, definition);
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
