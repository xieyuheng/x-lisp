#include "index.h"

static value_t
x_function_name(value_t sexp) {
    return x_car(x_car(sexp));
}

static value_t
x_function_parameters(value_t sexp) {
    return x_cdr(x_car(sexp));
}

static value_t
x_function_body(value_t sexp) {
    return x_cdr(sexp);
}

static void
prepare_define_function(mod_t *mod, value_t sexp) {
    char *name = to_symbol(x_function_name(sexp))->string;
    function_t *function = make_function();
    define_function(mod, name, function);
    compile_parameters(mod, function, x_function_parameters(sexp));
}

static void
handle_define_function(mod_t *mod, value_t sexp) {
    char *name = to_symbol(x_function_name(sexp))->string;
    definition_t *definition = mod_lookup(mod, name);
    assert(definition->kind == FUNCTION_DEFINITION);

    function_t *function = definition->function_definition.function;
    compile_function(mod, function, x_function_body(sexp));
}

static value_t
x_variable_name(value_t sexp) {
    return x_car(sexp);
}

static value_t
x_variable_body(value_t sexp) {
    return x_cdr(sexp);
}

static void
prepare_define_variable(mod_t *mod, value_t sexp) {
    char *name = to_symbol(x_variable_name(sexp))->string;
    function_t *function = make_function();
    define_variable_setup(mod, name, function);
}

static void
handle_define_variable(mod_t *mod, value_t sexp) {
    char *name = to_symbol(x_variable_name(sexp))->string;
    definition_t *definition = mod_lookup(mod, name);
    assert(definition->kind == VARIABLE_DEFINITION);

    function_t *function = definition->variable_definition.function;
    compile_function(mod, function, x_variable_body(sexp));
}

void
basic_prepare(mod_t *mod, value_t sexps) {
    for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        if (sexp_has_tag(sexp, "define-function")) {
            prepare_define_function(mod, x_cdr(sexp));
        }

        if (sexp_has_tag(sexp, "define-variable")) {
            prepare_define_variable(mod, x_cdr(sexp));
        }
    }
}

void
basic_compile(mod_t *mod, value_t sexps) {
    for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        if (sexp_has_tag(sexp, "define-function")) {
            handle_define_function(mod, x_cdr(sexp));
        }

        if (sexp_has_tag(sexp, "define-variable")) {
            handle_define_variable(mod, x_cdr(sexp));
        }
    }
}
