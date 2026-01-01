#include "index.h"

mod_t *
make_mod(path_t *path) {
    mod_t *self = new(mod_t);
    self->path = path;
    self->definitions = make_record_with((free_fn_t *) definition_free);
    self->import_entries = make_array_with((free_fn_t *) import_entry_free);
    self->exported_names = make_string_set();
    return self;
}

void
mod_free(mod_t *self) {
    path_free(self->path);
    record_free(self->definitions);
    array_free(self->import_entries);
    set_free(self->exported_names);
    free(self);
}

void
mod_define(mod_t *self, const char *name, definition_t *definition) {
    definition_t *found = record_get(self->definitions, name);
    if (found) {
        if (found->kind != PLACEHOLDER_DEFINITION) {
            who_printf("can not redefine name: %s\n", name);
            exit(1);
        }

        size_t length =
            array_length(found->placeholder_definition.placeholders);
        for (size_t i = 0; i < length; i ++) {
            placeholder_t *placeholder =
                array_get(found->placeholder_definition.placeholders, i);
            function_put_definition(
                placeholder->function,
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

mod_t *
mod_load_by(mod_t *self, const char *string) {
    path_t *path = path_copy(self->path);
    path_join_mut(path, "..");
    path_join_mut(path, string);
    return load(path);
}

import_entry_t *
make_import_entry(mod_t *mod, char *name) {
    import_entry_t *self = new(import_entry_t);
    self->mod = mod;
    self->name = name;
    self->is_exported = false;
    return self;
}

void
import_entry_free(import_entry_t *self) {
    string_free(self->name);
    free(self);
}
