#include "index.h"

static void compile_return(vm_t *vm, definition_t *definition);
static void compile_token(vm_t *vm, definition_t *definition, const token_t *token);
static void compile_word(vm_t *vm, definition_t *definition, const char *word);
static void compile_tail_call(vm_t *vm, definition_t *definition);
static void compile_parameters(vm_t *vm, definition_t *definition, const char *terminator);
static void compile_bindings(vm_t *vm, definition_t *definition, const char *terminator);

void
compile_function(vm_t *vm, definition_t *definition) {
    assert(definition->kind == FUNCTION_DEFINITION);
    while (true) {
        if (list_is_empty(vm->tokens)) {
            assert(false);
        }

        token_t *token = list_shift(vm->tokens);
        if (string_equal(token->content, "@end")) {
            compile_return(vm, definition);
            token_free(token);
            return;
        } else if (string_equal(token->content, "[")) {
            compile_parameters(vm, definition, "]");
            token_free(token);
        } else {
            compile_token(vm, definition, token);
            token_free(token);
        }
    }
}

static void
compile_return(vm_t *vm, definition_t *definition) {
    (void) vm;
    struct instr_t instr = { .op = OP_RETURN };
    function_definition_append_instr(definition, instr);
}

static void
compile_token(vm_t *vm, definition_t *definition, const token_t *token) {
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        if (string_equal(token->content, "@return")) {
            compile_return(vm, definition);
            return;
        } else if (string_equal(token->content, "@tail-call")) {
            compile_tail_call(vm, definition);
            return;
        } else {
            compile_word(vm, definition, token->content);
            return;
        }
    }

    case STRING_TOKEN: {
        TODO();
        return;
    }

    case INT_TOKEN: {
        struct instr_t instr = {
            .op = OP_LITERAL_INT,
            .literal_int.content = string_parse_int(token->content),
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    case FLOAT_TOKEN: {
        struct instr_t instr = {
            .op = OP_LITERAL_FLOAT,
            .literal_float.content = string_parse_double(token->content),
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    case BRACKET_START_TOKEN: {
        compile_bindings(vm, definition, "]");
        return;
    }

    case BRACKET_END_TOKEN: {
        who_printf("missing BRACKET_START_TOKEN: %s\n", token->content);
        assert(false);
    }

    case QUOTATION_MARK_TOKEN: {
        TODO();
        return;
    }

    case KEYWORD_TOKEN: {
        TODO();
        return;
    }

    case HASHTAG_TOKEN: {
        TODO();
        return;
    }

    case LINE_COMMENT_TOKEN: {
        return;
    }
    }
}

static void
compile_word(vm_t *vm, definition_t *definition, const char *word) {
    if (function_definition_has_binding_index(definition, word)) {
        size_t index = function_definition_get_binding_index(definition, word);
        struct instr_t instr = {
            .op = OP_LOCAL_LOAD,
            .local_load.index = index,
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    definition_t *found = mod_lookup(vm->mod, word);
    assert(found);

    switch (found->kind) {
    case PRIMITIVE_DEFINITION:
    case FUNCTION_DEFINITION: {
        struct instr_t instr = {
            .op = OP_CALL,
            .call.definition = found,
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    case VARIABLE_DEFINITION: {
        struct instr_t instr = {
            .op = OP_VAR_LOAD,
            .var_load.definition = found,
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    case CONSTANT_DEFINITION: {
        struct instr_t instr = {
            .op = OP_CONST_LOAD,
            .const_load.definition = found,
        };
        function_definition_append_instr(definition, instr);
        return;
    }
    }
}

static void
compile_tail_call(vm_t *vm, definition_t *definition) {
    token_t *token = list_shift(vm->tokens);
    assert(token->kind == SYMBOL_TOKEN);
    definition_t *found = mod_lookup(vm->mod, token->content);
    token_free(token);
    assert(found);
    assert(found->kind == FUNCTION_DEFINITION);

    struct instr_t instr = {
        .op = OP_TAIL_CALL,
        .tail_call.definition = found,
    };
    function_definition_append_instr(definition, instr);
}

static void
compile_local_store_stack(
    vm_t *vm,
    definition_t *definition,
    stack_t *local_name_stack)
{
    (void) vm;

    while (!stack_is_empty(local_name_stack)) {
        char *name = stack_pop(local_name_stack);
        size_t index = function_definition_get_binding_index(definition, name);
        struct instr_t instr = {
            .op = OP_LOCAL_STORE,
            .local_store.index = index,
        };
        function_definition_append_instr(definition, instr);
    }

    stack_free(local_name_stack);
}

static void
compile_parameters(vm_t *vm, definition_t *definition, const char *terminator) {
    definition->function_definition.parameters = make_string_array_auto();

    stack_t *local_name_stack = make_string_stack();

    while (true) {
        if (list_is_empty(vm->tokens)) {
            who_printf("missing terminator: %s\n", terminator);
            assert(false);
        }

        token_t *token = list_shift(vm->tokens);
        if (string_equal(token->content, terminator)) {
            token_free(token);
            compile_local_store_stack(vm, definition, local_name_stack);
            return;
        }

        assert(token->kind == SYMBOL_TOKEN);
        // different from `compile_bindings`.
        array_push(definition->function_definition.parameters,
                   string_copy(token->content));
        stack_push(local_name_stack, string_copy(token->content));
        function_definition_add_binding(definition, token->content);
        token_free(token);
    }
}

static void
compile_bindings(vm_t *vm, definition_t *definition, const char *terminator) {
    stack_t *local_name_stack = make_string_stack();

    while (true) {
        if (list_is_empty(vm->tokens)) {
            who_printf("missing terminator: %s\n", terminator);
            assert(false);
        }

        token_t *token = list_shift(vm->tokens);
        if (string_equal(token->content, terminator)) {
            token_free(token);
            compile_local_store_stack(vm, definition, local_name_stack);
            return;
        }

        assert(token->kind == SYMBOL_TOKEN);
        stack_push(local_name_stack, string_copy(token->content));
        function_definition_add_binding(definition, token->content);
        token_free(token);
    }

    compile_local_store_stack(vm, definition, local_name_stack);
}
