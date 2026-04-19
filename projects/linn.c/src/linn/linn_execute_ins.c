#include "index.h"

static definition_t *
ensure_definition(mod_t *mod, const char *name) {
    definition_t *definition = mod_lookup(mod, name);
    if (definition) {
        return definition;
    } else {
        function_t *function = make_function();
        define_function(mod, name, function);
        return mod_lookup(mod, name);
    }
}

static size_t
ensure_binding_index(function_t *function, const char *name) {
    if (!function_has_binding(function, name)) {
        function_add_binding(function, name);
    }

    size_t index = function_get_binding_index(function, name);
    return index;
}

void
linn_execute_ins(mod_t *mod, line_t *line) {
    const path_t *path = line_path(line);
    definition_t *definition = ensure_definition(mod, path_raw_string(path));
    function_t *function = definition_function(definition);
    line_var_t *op = to_line_var(line_get_arg(line, 0));

    if (string_equal(op->string, "literal")) {
        struct instr_t instr;
        instr.op = OP_LITERAL;
        instr.literal.value = line_get_arg(line, 1);
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "return")) {
        struct instr_t instr;
        instr.op = OP_RETURN;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "call")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        definition_t *definition = ensure_definition(mod, operand->string);
        struct instr_t instr;
        instr.op = OP_CALL;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "tail-call")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        definition_t *definition = ensure_definition(mod, operand->string);
        struct instr_t instr;
        instr.op = OP_TAIL_CALL;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "ref")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        definition_t *definition = ensure_definition(mod, operand->string);
        struct instr_t instr;
        instr.op = OP_REF;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "global-load")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        definition_t *definition = ensure_definition(mod, operand->string);
        struct instr_t instr;
        instr.op = OP_GLOBAL_LOAD;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "global-store")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        definition_t *definition = ensure_definition(mod, operand->string);
        struct instr_t instr;
        instr.op = OP_GLOBAL_STORE;
        instr.ref.definition = definition;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "apply")) {
        struct instr_t instr;
        instr.op = OP_APPLY;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "tail-apply")) {
        struct instr_t instr;
        instr.op = OP_TAIL_APPLY;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "local-load")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        size_t index = ensure_binding_index(function, operand->string);
        struct instr_t instr;
        instr.op = OP_LOCAL_LOAD;
        instr.local.index = index;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "local-store")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        size_t index = ensure_binding_index(function, operand->string);
        struct instr_t instr;
        instr.op = OP_LOCAL_STORE;
        instr.local.index = index;
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "label")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        function_add_label(function, operand->string);
        return;
    }

    if (string_equal(op->string, "jump")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        struct instr_t instr;
        instr.op = OP_JUMP;
        instr.jump.offset = 0;
        function_add_label_reference(
            function, operand->string, function->code_length + 1);
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "jump-if-not")) {
        line_var_t *operand = to_line_var(line_get_arg(line, 1));
        struct instr_t instr;
        instr.op = OP_JUMP_IF_NOT;
        instr.jump.offset = 0;
        function_add_label_reference(
            function, operand->string, function->code_length + 1);
        function_append_instr(function, instr);
        return;
    }

    if (string_equal(op->string, "drop")) {
        struct instr_t instr;
        instr.op = OP_DROP;
        function_append_instr(function, instr);
        return;
    }

    who_printf("unhandled op: %s\n", op->string);
}
