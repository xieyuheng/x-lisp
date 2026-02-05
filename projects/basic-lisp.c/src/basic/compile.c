#include "index.h"

static bool
is_var(value_t sexp) {
    return symbol_p(sexp);
}

static bool
is_literal(value_t sexp) {
    return hashtag_p(sexp)
        || xstring_p(sexp)
        || int_p(sexp)
        || float_p(sexp);
}

static bool
is_quote(value_t sexp) {
    return tael_p(sexp)
        && equal_p(x_car(sexp), x_object(intern_symbol("@quote")));
}

static bool
is_apply(value_t sexp) {
    return tael_p(sexp);
}

static void
compile_var(mod_t *mod, function_t *function, value_t sexp) {
    char *name = to_symbol(sexp)->string;
    if (function_has_binding_index(function, name)) {
        size_t index = function_get_binding_index(function, name);
        struct instr_t instr;
        instr.op = OP_LOCAL_LOAD;
        instr.local.index = index;
        function_append_instr(function, instr);
        return;
    }

    definition_t *definition = mod_lookup(mod, name);
    if (!definition) {
        who_printf("undefined name: %s\n", name);
        exit(1);
    }

    if (definition->kind == VARIABLE_DEFINITION) {
        struct instr_t instr;
        instr.op = OP_CALL;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        return;
    } else {
        struct instr_t instr;
        instr.op = OP_REF;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        return;
    }
}

static void
compile_literal(mod_t *mod, function_t *function, value_t sexp) {
    (void) mod;
    struct instr_t instr;
    instr.op = OP_LITERAL;
    instr.literal.value = sexp;
    function_append_instr(function, instr);
}

static void
compile_quote(mod_t *mod, function_t *function, value_t sexp) {
    (void) mod;
    value_t value = x_car(x_cdr(sexp));
    struct instr_t instr;
    instr.op = OP_LITERAL;
    instr.literal.value = value;
    function_append_instr(function, instr);
}

static void
compile_args(mod_t *mod, function_t *function, value_t args) {
    for (int64_t i = 0; i < to_int64(x_list_length(args)); i++) {
        value_t arg = x_list_get(x_int(i), args);
        compile_exp(mod, function, arg);
    }
}

static void
compile_apply(mod_t *mod, function_t *function, value_t sexp) {
    value_t args = x_cdr(sexp);
    compile_args(mod, function, args);

    value_t target = x_car(sexp);
    char *name = to_symbol(target)->string;
    if (function_has_binding_index(function, name)) {
        size_t index = function_get_binding_index(function, name);
        struct instr_t instr;
        instr.op = OP_LOCAL_LOAD;
        instr.local.index = index;
        function_append_instr(function, instr);
        instr.op = OP_LITERAL;
        instr.literal.value = x_list_length(args);
        function_append_instr(function, instr);
        instr.op = OP_APPLY;
        function_append_instr(function, instr);
        return;
    }

    definition_t *definition = mod_lookup(mod, name);
    if (!definition) {
        who_printf("undefined name: %s\n", name);
        exit(1);
    }

    if (!definition_has_arity(definition)) {
        struct instr_t instr;
        instr.op = OP_CALL;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        instr.op = OP_LITERAL;
        instr.literal.value = x_list_length(args);
        function_append_instr(function, instr);
        instr.op = OP_APPLY;
        function_append_instr(function, instr);
        return;
    }

    size_t arity = definition_arity(definition);
    size_t args_length = to_int64(x_list_length(args));
    if (args_length < arity) {
        struct instr_t instr;
        instr.op = OP_REF;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        instr.op = OP_LITERAL;
        instr.literal.value = x_list_length(args);
        function_append_instr(function, instr);
        instr.op = OP_APPLY;
        function_append_instr(function, instr);
        return;
    } else if (args_length == arity) {
        struct instr_t instr;
        instr.op = OP_CALL;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        return;
    } else {
        where_printf("too many arguments\n");
        where_printf("  function: %s\n", name);
        where_printf("  arity: %ld\n", arity);
        where_printf("  args_length: %ld\n", args_length);
        exit(1);
    }
}

static void
compile_tail_apply(mod_t *mod, function_t *function, value_t sexp) {
    value_t args = x_cdr(sexp);
    compile_args(mod, function, args);

    value_t target = x_car(sexp);
    char *name = to_symbol(target)->string;
    if (function_has_binding_index(function, name)) {
        size_t index = function_get_binding_index(function, name);
        struct instr_t instr;
        instr.op = OP_LOCAL_LOAD;
        instr.local.index = index;
        function_append_instr(function, instr);
        instr.op = OP_LITERAL;
        instr.literal.value = x_list_length(args);
        function_append_instr(function, instr);
        instr.op = OP_TAIL_APPLY;
        function_append_instr(function, instr);
        return;
    }

    definition_t *definition = mod_lookup(mod, name);
    if (!definition) {
        who_printf("undefined name: %s\n", name);
        exit(1);
    }

    if (!definition_has_arity(definition)) {
        struct instr_t instr;
        instr.op = OP_CALL;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        instr.op = OP_LITERAL;
        instr.literal.value = x_list_length(args);
        function_append_instr(function, instr);
        instr.op = OP_TAIL_APPLY;
        function_append_instr(function, instr);
        return;
    }

    size_t arity = definition_arity(definition);
    size_t args_length = to_int64(x_list_length(args));
    if (args_length < arity) {
        struct instr_t instr;
        instr.op = OP_REF;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        instr.op = OP_LITERAL;
        instr.literal.value = x_list_length(args);
        function_append_instr(function, instr);
        instr.op = OP_TAIL_APPLY;
        function_append_instr(function, instr);
        return;
    } else if (args_length == arity) {
        struct instr_t instr;
        instr.op = OP_TAIL_CALL;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        return;
    } else {
        where_printf("too many arguments\n");
        where_printf("  function: %s\n", name);
        where_printf("  arity: %ld\n", arity);
        where_printf("  args_length: %ld\n", args_length);
        exit(1);
    }
}

void
compile_exp(mod_t *mod, function_t *function, value_t sexp) {
    if (is_var(sexp)) {
        compile_var(mod, function, sexp);
    } else if (is_literal(sexp)) {
        compile_literal(mod, function, sexp);
    } else if (is_quote(sexp)) {
        compile_quote(mod, function, sexp);
    } else if (is_apply(sexp)) {
        compile_apply(mod, function, sexp);
    }
}

static void
compile_tail_exp(mod_t *mod, function_t *function, value_t sexp) {
    if (is_var(sexp)) {
        compile_var(mod, function, sexp);
        struct instr_t instr;
        instr.op = OP_RETURN;
        function_append_instr(function, instr);
        return;
    } else if (is_literal(sexp)) {
        compile_literal(mod, function, sexp);
        struct instr_t instr;
        instr.op = OP_RETURN;
        function_append_instr(function, instr);
        return;
    } else if (is_quote(sexp)) {
        compile_quote(mod, function, sexp);
        struct instr_t instr;
        instr.op = OP_RETURN;
        function_append_instr(function, instr);
        return;
    } else if (is_apply(sexp)) {
        compile_tail_apply(mod, function, sexp);
        return;
    }
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
    compile_exp(mod, function, x_car(x_cdr(sexp)));
    char *name = to_symbol(x_car(sexp))->string;
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
    if (true_p(x_list_empty_p(sexp))) {
        struct instr_t instr;
        instr.op = OP_LITERAL;
        instr.literal.value = x_void;
        function_append_instr(function, instr);
        instr.op = OP_RETURN;
        function_append_instr(function, instr);
        return;
    }

    compile_tail_exp(mod, function, x_car(sexp));
}

static void
compile_instr(mod_t *mod, function_t *function, value_t sexp) {
    if (is_assign(sexp)) {
        compile_assign(mod, function, x_cdr(sexp));
    } else if (is_perform(sexp)) {
        compile_perform(mod, function, x_cdr(sexp));
    } else if (is_test(sexp)) {
        compile_test(mod, function, x_cdr(sexp));
    } else if (is_branch(sexp)) {
        compile_branch(mod, function, x_cdr(sexp));
    } else if (is_goto(sexp)) {
        compile_goto(mod, function, x_cdr(sexp));
    } else if (is_return(sexp)) {
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

void
compile_parameters(mod_t *mod, function_t *function, value_t parameters) {
    (void) mod;
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
collect_variables_from_instr(function_t *function, value_t sexp) {
    if (is_assign(sexp)) {
        char *name = to_symbol(x_car(x_cdr(sexp)))->string;
        function_add_binding(function, name);
    }
}

static void
collect_variables_from_block(function_t *function, value_t block) {
    for (int64_t i = 0; i < to_int64(x_list_length(x_block_body(block))); i++) {
        value_t instr = x_list_get(x_int(i), x_block_body(block));
        collect_variables_from_instr(function, instr);
    }
}

void
compile_function(mod_t *mod, function_t *function, value_t body) {
    for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
        value_t sexp = x_list_get(x_int(i), body);
        assert(is_block(sexp));
        collect_variables_from_block(function, sexp);
    }

    for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
        value_t sexp = x_list_get(x_int(i), body);
        assert(is_block(sexp));
        compile_block(mod, function, sexp);
    }

    function_patch_label_references(function);
}
