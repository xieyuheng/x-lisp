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
        who_printf("can not redefine name: %s\n", name);
        exit(1);
    }

    record_put(self->definitions, name, definition);
}

definition_t *
mod_lookup(mod_t *self, const char *name) {
    return record_get(self->definitions, name);
}

import_entry_t *
make_import_entry(mod_t *mod, char *name) {
    import_entry_t *self = new(import_entry_t);
    self->mod = mod;
    self->name = name;
    self->rename = NULL;
    self->is_exported = false;
    return self;
}

void
import_entry_free(import_entry_t *self) {
    string_free(self->name);
    if (self->rename) {
        string_free(self->rename);
    }

    free(self);
}

static void
mod_inspect_definition(const definition_t *self) {
    switch (self->kind) {
    case FUNCTION_DEFINITION: {
        function_inspect(self->function_definition.function);
        return;
    }
    case PRIMITIVE_DEFINITION: {
        return;
    }

    case VARIABLE_DEFINITION: {
        if (self->variable_definition.function) {
            // function_inspect(self->variable_definition.function);
        }

        return;
    }
    }

    unreachable();
}

void
mod_inspect(const mod_t *mod) {
    record_iter_t iter;
    record_iter_init(&iter, mod->definitions);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        char *name = entry->key;
        definition_t *definition = entry->value;
        if (definition->mod == mod) {
            string_print(name);
            if (!string_equal(name, definition->name)) {
                string_print(" -> ");
                string_print(definition->name);
            }
            newline();

            mod_inspect_definition(definition);
        }


        entry = record_iter_next_entry(&iter);
    }
}
