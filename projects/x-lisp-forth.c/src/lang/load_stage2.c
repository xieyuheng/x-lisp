#include "index.h"

static void handle_import_entries(mod_t *mod);

void
load_stage2(vm_t *vm) {
    handle_import_entries(vm_mod(vm));
}

static void
handle_import_entry(mod_t *mod, const import_entry_t *import_entry) {
    definition_t *definition = mod_lookup(import_entry->mod, import_entry->name);
    mod_define(mod, import_entry->name, definition);
    if (import_entry->is_exported) {
        set_add(mod->exported_names, import_entry->name);
    }
}

static void
handle_import_entries(mod_t *mod) {
    array_t *import_entries = mod->import_entries;
    for (size_t i = 0; i < array_length(import_entries); i++) {
        import_entry_t *import_entry = array_get(import_entries, i);
        handle_import_entry(mod, import_entry);
    }
}
