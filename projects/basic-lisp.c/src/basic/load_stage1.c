#include "index.h"

static bool is_define_function(value_t sexp);
static void handle_define_function(mod_t *mod, value_t sexp);

void
load_stage1(mod_t *mod, value_t sexps) {
    size_t length = to_int64(x_list_length(sexps));
    for (size_t i = 0; i < length; i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        if (is_define_function(sexp)) {
            handle_define_function(mod, x_cdr(sexp));
        }
    }
}

static bool
is_define_function(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("define-function")));
}

static value_t x_function_name(value_t sexp);
static value_t x_function_parameters(value_t sexp);

static void
handle_define_function(mod_t *mod, value_t sexp) {
    function_t *function = make_function();
    define_function(mod, to_symbol(x_function_name(sexp))->string, function);
    // compile_function(vm, function);

    print(x_function_name(sexp));
    x_newline();
    print(x_function_parameters(sexp));
    x_newline();
}

static value_t
x_function_name(value_t sexp) {
    return x_car(x_car(sexp));
}

static value_t
x_function_parameters(value_t sexp) {
    return x_cdr(x_car(sexp));
}
