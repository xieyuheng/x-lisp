#include "index.h"

static bool
is_export(value_t sexp) {
    return sexp_has_tag(sexp, "export");
}

static void
handle_export(mod_t *mod, value_t body) {
    for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
        value_t sexp = x_list_get(x_int(i), body);
        char *name = to_symbol(sexp)->string;
        set_add(mod->exported_names, string_copy(name));
    }
}

void
basic_export(mod_t *mod, value_t sexps) {
    for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        if (is_export(sexp)) {
            handle_export(mod, x_cdr(sexp));
        }
    }
}
