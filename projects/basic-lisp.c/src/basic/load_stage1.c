#include "index.h"

static bool
is_define_function(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("define-function")));
}

static bool
is_define_variable(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("define-variable")));
}

static void handle_define_function(mod_t *mod, value_t sexp);
static void handle_define_variable(mod_t *mod, value_t sexp);

static void compile_parameters(function_t *function, value_t sexp);
static void compile_function(mod_t *mod, function_t *function, value_t sexp);

static void
handle_stmt(mod_t *mod, value_t sexp) {
    if (is_define_function(sexp))
        handle_define_function(mod, x_cdr(sexp));
    if (is_define_variable(sexp))
        handle_define_variable(mod, x_cdr(sexp));
}

void
load_stage1(mod_t *mod, value_t sexps) {
    for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        handle_stmt(mod, sexp);
    }
}

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
handle_define_function(mod_t *mod, value_t sexp) {
    function_t *function = make_function();
    define_function(mod, to_symbol(x_function_name(sexp))->string, function);
    compile_parameters(function, x_function_parameters(sexp));
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
handle_define_variable(mod_t *mod, value_t sexp) {
    function_t *function = make_function();
    define_variable_setup(mod, to_symbol(x_variable_name(sexp))->string, function);
    compile_function(mod, function, x_variable_body(sexp));
}

static void
compile_local_store_stack(function_t *function, stack_t *local_name_stack) {
    while (!stack_is_empty(local_name_stack)) {
        char *name = stack_pop(local_name_stack);
        size_t index = function_get_binding_index(function, name);
        struct instr_t instr;
        instr.op = OP_LOCAL_STORE;
        instr.local.index = index;
        function_append_instr(function, instr);
    }

    stack_free(local_name_stack);
}

static void
compile_parameters(function_t *function, value_t parameters) {
    function->parameters = make_string_array();
    stack_t *local_name_stack = make_string_stack();
    for (int64_t i = 0; i < to_int64(x_list_length(parameters)); i++) {
        value_t parameter = x_list_get(x_int(i), parameters);
        assert(symbol_p(parameter));
        array_push(function->parameters, string_copy(to_symbol(parameter)->string));
        stack_push(local_name_stack, string_copy(to_symbol(parameter)->string));
        function_add_binding(function, to_symbol(parameter)->string);
    }

    compile_local_store_stack(function, local_name_stack);
}

static void
compile_exp(mod_t *mod, function_t *function, value_t sexp) {
    (void) mod;
    (void) function;
    print(sexp);
    newline();
}

static void
compile_tail_exp(mod_t *mod, function_t *function, value_t sexp) {
    (void) mod;
    (void) function;
    print(sexp);
    newline();
}

static bool
is_assign(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("=")));
}

static bool
is_perform(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("perform")));
}

static bool
is_test(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("test")));
}

static bool
is_branch(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("branch")));
}

static bool
is_goto(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("goto")));
}

static bool
is_return(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("return")));
}

static void
compile_assign(mod_t *mod, function_t *function, value_t sexp) {
    compile_exp(mod, function, x_car(sexp));
    char *name = to_symbol(x_car(sexp))->string;
    function_add_binding(function, name);
    size_t index = function_get_binding_index(function, name);
    struct instr_t instr;
    instr.op = OP_LOCAL_STORE;
    instr.local.index = index;
    function_append_instr(function, instr);
}

static void
compile_perform(mod_t *mod, function_t *function, value_t sexp) {
    compile_exp(mod, function, x_car(sexp));
    struct instr_t instr;
    instr.op = OP_DROP;
    function_append_instr(function, instr);
}

static void
compile_test(mod_t *mod, function_t *function, value_t sexp) {
    compile_exp(mod, function, x_car(sexp));
}

static void
compile_branch(mod_t *mod, function_t *function, value_t sexp) {
    (void) mod;
    char *then_label = to_symbol(x_car(sexp))->string;
    char *else_label = to_symbol(x_car(x_cdr(sexp)))->string;
    struct instr_t instr;
    instr.op = OP_JUMP_IF_NOT;
    instr.jump.offset = 0;
    function_add_label_reference(function, else_label, function->code_length + 1);
    function_append_instr(function, instr);
    instr.op = OP_JUMP;
    instr.jump.offset = 0;
    function_add_label_reference(function, then_label, function->code_length + 1);
    function_append_instr(function, instr);
}

static void
compile_goto(mod_t *mod, function_t *function, value_t sexp) {
    (void) mod;
    char *label = to_symbol(x_car(sexp))->string;
    struct instr_t instr;
    instr.op = OP_JUMP;
    instr.jump.offset = 0;
    function_add_label_reference(function, label, function->code_length + 1);
    function_append_instr(function, instr);
}

static void
compile_return(mod_t *mod, function_t *function, value_t sexp) {
    compile_tail_exp(mod, function, x_car(sexp));
}

static void
compile_instr(mod_t *mod, function_t *function, value_t sexp) {
    if (is_assign(sexp)) {
        compile_assign(mod, function, x_cdr(sexp));
    }

    if (is_perform(sexp)) {
        compile_perform(mod, function, x_cdr(sexp));
    }

    if (is_test(sexp)) {
        compile_test(mod, function, x_cdr(sexp));
    }

    if (is_branch(sexp)) {
        compile_branch(mod, function, x_cdr(sexp));
    }

    if (is_goto(sexp)) {
        compile_goto(mod, function, x_cdr(sexp));
    }

    if (is_return(sexp)) {
        compile_return(mod, function, x_cdr(sexp));
    }
}

static bool
is_block(value_t sexp) {
    return equal_p(x_car(sexp), x_object(intern_symbol("block")));
}

static value_t
x_block_name(value_t sexp) {
    return x_car(x_cdr(sexp));
}

static value_t
x_block_body(value_t sexp) {
    return x_cdr(x_cdr(sexp));
}

static void
compile_block(mod_t *mod, function_t *function, value_t block) {
    function_add_label(function, to_symbol(x_block_name(block))->string);
    for (int64_t i = 0; i < to_int64(x_list_length(x_block_body(block))); i++) {
        value_t instr = x_list_get(x_int(i), x_block_body(block));
        compile_instr(mod, function, instr);
    }
}

static void
compile_function(mod_t *mod, function_t *function, value_t body) {
    for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
        value_t sexp = x_list_get(x_int(i), body);
        assert(is_block(sexp));
        compile_block(mod, function, sexp);
    }
}
