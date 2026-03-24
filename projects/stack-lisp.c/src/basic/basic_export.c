#include "index.h"

static void
handle_export(mod_t *mod, value_t body) {
    for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
        value_t sexp = x_list_get(x_int(i), body);
        char *name = to_symbol(sexp)->string;
        set_add(mod->exported_names, string_copy(name));
    }
}

static void
handle_export_all(mod_t *mod) {
    record_iter_t iter;
    record_iter_init(&iter, mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (definition->mod == mod) {
            set_add(mod->exported_names, string_copy(definition->name));
        }

        definition = record_iter_next_value(&iter);
    }
}

static void
handle_export_except(mod_t *mod, value_t sexp) {
    set_t *excepted_names = make_string_set();
    value_t body = sexp;
    for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
        value_t sexp = x_list_get(x_int(i), body);
        char *name = to_symbol(sexp)->string;
        set_add(excepted_names, string_copy(name));
    }

    record_iter_t iter;
    record_iter_init(&iter, mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (definition->mod == mod
            && !set_member(excepted_names, definition->name)) {
            set_add(mod->exported_names, string_copy(definition->name));
        }

        definition = record_iter_next_value(&iter);
    }

    set_free(excepted_names);
}

void
basic_export(mod_t *mod, value_t sexps) {
    for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        if (sexp_has_tag(sexp, "export")) {
            handle_export(mod, x_cdr(sexp));
        }

        if (sexp_has_tag(sexp, "export-all")) {
            handle_export_all(mod);
        }

        if (sexp_has_tag(sexp, "export-except")) {
            handle_export_except(mod, x_cdr(sexp));
        }
    }
}
