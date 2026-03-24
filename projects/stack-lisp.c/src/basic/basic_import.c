#include "index.h"

static mod_t *
import_by(mod_t *mod, const char *string) {
    path_t *path = path_copy(mod->path);
    path_join_mut(path, "..");
    path_join_mut(path, string);

    if (pathname_is_directory(path_string(path))) {
        path_join_mut(path, "index.basic");
    }

    if (!string_ends_with(path_top_segment(path), ".basic")) {
        char *segment = path_pop_segment(path);
        path_push_segment(path, string_append(segment, ".basic"));
        string_free(segment);
    }

    return basic_load(path);
}

static void
collect_import(mod_t *mod, value_t sexp, bool is_exported) {
    char *imported_name = to_xstring(x_car(sexp))->string;
    mod_t *imported_mod = import_by(mod, imported_name);

    value_t body = x_cdr(sexp);
    for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
        value_t sexp = x_list_get(x_int(i), body);
        char *name = to_symbol(sexp)->string;
        import_entry_t *import_entry = make_import_entry(imported_mod, name);
        import_entry->is_exported = is_exported;
        array_push(mod->import_entries, import_entry);
    }
}

static void
collect_import_all(mod_t *mod, value_t sexp, bool is_exported) {
    char *imported_name = to_xstring(x_car(sexp))->string;
    mod_t *imported_mod = import_by(mod, imported_name);

    record_iter_t iter;
    record_iter_init(&iter, imported_mod->definitions);
    char *key = record_iter_next_key(&iter);
    while (key) {
        if (set_member(imported_mod->exported_names, key)) {
            char *name = string_copy(key);
            import_entry_t *import_entry = make_import_entry(imported_mod, name);
            import_entry->is_exported = is_exported;
            array_push(mod->import_entries, import_entry);
        }

        key = record_iter_next_key(&iter);
    }
}

static void
collect_import_except(mod_t *mod, value_t sexp, bool is_exported) {
    char *imported_name = to_xstring(x_car(sexp))->string;
    mod_t *imported_mod = import_by(mod, imported_name);

    set_t *excepted_names = make_string_set();
    value_t body = x_cdr(sexp);
    for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
        value_t sexp = x_list_get(x_int(i), body);
        char *name = to_symbol(sexp)->string;
        set_add(excepted_names, string_copy(name));
    }

    record_iter_t iter;
    record_iter_init(&iter, imported_mod->definitions);
    char *key = record_iter_next_key(&iter);
    while (key) {
        if (set_member(imported_mod->exported_names, key)
            && !set_member(excepted_names, key)) {
            char *name = string_copy(key);
            import_entry_t *import_entry =
                make_import_entry(imported_mod, name);
            import_entry->is_exported = is_exported;
            array_push(mod->import_entries, import_entry);
        }

        key = record_iter_next_key(&iter);
    }

    set_free(excepted_names);
}

static void
collect_import_as(mod_t *mod, value_t sexp, bool is_exported) {
    char *imported_name = to_xstring(x_car(sexp))->string;
    mod_t *imported_mod = import_by(mod, imported_name);

    char *prefix = to_symbol(x_car(x_cdr(sexp)))->string;

    record_iter_t iter;
    record_iter_init(&iter, imported_mod->definitions);
    char *key = record_iter_next_key(&iter);
    while (key) {
        if (set_member(imported_mod->exported_names, key)) {
            char *name = string_copy(key);
            char *rename = string_append(prefix, key);
            import_entry_t *import_entry = make_import_entry(imported_mod, name);
            import_entry->rename = rename;
            import_entry->is_exported = is_exported;
            array_push(mod->import_entries, import_entry);
        }

        key = record_iter_next_key(&iter);
    }
}

static void
handle_import_entry(mod_t *mod, const import_entry_t *import_entry) {
    definition_t *definition = mod_lookup(import_entry->mod, import_entry->name);
    assert(definition);

    char *name = import_entry->rename
        ? import_entry->rename
        : import_entry->name;

    mod_define(mod, name, definition);

    if (import_entry->is_exported) {
        set_add(mod->exported_names, string_copy(name));
    }
}

void
basic_import(mod_t *mod, value_t sexps) {
    for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        if (sexp_has_tag(sexp, "import")) {
            collect_import(mod, x_cdr(sexp), false);
        }

        if (sexp_has_tag(sexp, "include")) {
            collect_import(mod, x_cdr(sexp), true);
        }

        if (sexp_has_tag(sexp, "import-all")) {
            collect_import_all(mod, x_cdr(sexp), false);
        }

        if (sexp_has_tag(sexp, "include-all")) {
            collect_import_all(mod, x_cdr(sexp), true);
        }

        if (sexp_has_tag(sexp, "import-except")) {
            collect_import_except(mod, x_cdr(sexp), false);
        }

        if (sexp_has_tag(sexp, "include-except")) {
            collect_import_except(mod, x_cdr(sexp), true);
        }

        if (sexp_has_tag(sexp, "import-as")) {
            collect_import_as(mod, x_cdr(sexp), false);
        }

        if (sexp_has_tag(sexp, "include-as")) {
            collect_import_as(mod, x_cdr(sexp), true);
        }
    }

    array_t *import_entries = mod->import_entries;
    for (size_t i = 0; i < array_length(import_entries); i++) {
        import_entry_t *import_entry = array_get(import_entries, i);
        handle_import_entry(mod, import_entry);
    }
}
