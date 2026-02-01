#include "index.h"

static bool
is_import(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("import")));
}

static bool
is_include(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("include")));
}

static bool
is_import_all(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("import-all")));
}

static bool
is_include_all(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("include-all")));
}

static bool
is_import_except(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("import-except")));
}

static bool
is_include_except(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("include-except")));
}

static bool
is_import_as(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("import-as")));
}

static bool
is_include_as(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("include-as")));
}

static void
collect_import(mod_t *mod, value_t sexp, bool is_exported) {
    char *imported_name = to_symbol(x_car(sexp))->string;
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
    (void) mod;
    (void) sexp;
    (void) is_exported;
}

static void
collect_import_except(mod_t *mod, value_t sexp, bool is_exported) {
    (void) mod;
    (void) sexp;
    (void) is_exported;
}

static void
collect_import_as(mod_t *mod, value_t sexp, bool is_exported) {
    (void) mod;
    (void) sexp;
    (void) is_exported;
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
load_stage2(mod_t *mod, value_t sexps) {
    for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        if (is_import(sexp)) {
            collect_import(mod, x_cdr(sexp), false);
        }

        if (is_include(sexp)) {
            collect_import(mod, x_cdr(sexp), true);
        }

        if (is_import_all(sexp)) {
            collect_import_all(mod, x_cdr(sexp), false);
        }

        if (is_include_all(sexp)) {
            collect_import_all(mod, x_cdr(sexp), true);
        }

        if (is_import_except(sexp)) {
            collect_import_except(mod, x_cdr(sexp), false);
        }

        if (is_include_except(sexp)) {
            collect_import_except(mod, x_cdr(sexp), true);
        }

        if (is_import_as(sexp)) {
            collect_import_as(mod, x_cdr(sexp), false);
        }

        if (is_include_as(sexp)) {
            collect_import_as(mod, x_cdr(sexp), true);
        }
    }

    array_t *import_entries = mod->import_entries;
    for (size_t i = 0; i < array_length(import_entries); i++) {
        import_entry_t *import_entry = array_get(import_entries, i);
        handle_import_entry(mod, import_entry);
    }
}
