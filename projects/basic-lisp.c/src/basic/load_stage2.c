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
handle_import(mod_t *mod, value_t sexp, bool is_exported) {
    (void) mod;
    (void) sexp;
    (void) is_exported;
}

static void
handle_import_all(mod_t *mod, value_t sexp, bool is_exported) {
    (void) mod;
    (void) sexp;
    (void) is_exported;
}

static void
handle_import_except(mod_t *mod, value_t sexp, bool is_exported) {
    (void) mod;
    (void) sexp;
    (void) is_exported;
}

static void
handle_import_as(mod_t *mod, value_t sexp, bool is_exported) {
    (void) mod;
    (void) sexp;
    (void) is_exported;
}

void
load_stage2(mod_t *mod, value_t sexps) {
    for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        if (is_import(sexp)) {
            handle_import(mod, x_cdr(sexp), false);
        }

        if (is_include(sexp)) {
            handle_import(mod, x_cdr(sexp), true);
        }

        if (is_import_all(sexp)) {
            handle_import_all(mod, x_cdr(sexp), false);
        }

        if (is_include_all(sexp)) {
            handle_import_all(mod, x_cdr(sexp), true);
        }

        if (is_import_except(sexp)) {
            handle_import_except(mod, x_cdr(sexp), false);
        }

        if (is_include_except(sexp)) {
            handle_import_except(mod, x_cdr(sexp), true);
        }

        if (is_import_as(sexp)) {
            handle_import_as(mod, x_cdr(sexp), false);
        }

        if (is_include_as(sexp)) {
            handle_import_as(mod, x_cdr(sexp), true);
        }
    }
}
