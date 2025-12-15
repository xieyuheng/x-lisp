#include "index.h"

static void compile_return(definition_t *definition);
static void compile_token(vm_t *vm, definition_t *definition, token_t *token);
static void compile_word(vm_t *vm, definition_t *definition, const char *word);
static void compile_invoke(vm_t *vm, definition_t *definition, const char *name);
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
            token_free(token);
            compile_return(definition);
            return;
        } else if (string_equal(token->content, "[")) {
            token_free(token);
            compile_parameters(vm, definition, "]");
        } else {
            compile_token(vm, definition, token);
        }
    }
}

static void
compile_return(definition_t *definition) {
    struct instr_t instr = { .op = OP_RETURN };
    function_definition_append_instr(definition, instr);
}

static void
compile_token(vm_t *vm, definition_t *definition, token_t *token) {
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        if (string_equal(token->content, "@assert")) {
            struct instr_t instr = {
                .op = OP_ASSERT,
                .assert.token = token,
            };
            function_definition_append_instr(definition, instr);
            return;
        }

        if (string_equal(token->content, "@assert-equal")) {
            struct instr_t instr = {
                .op = OP_ASSERT_EQUAL,
                .assert.token = token,
            };
            function_definition_append_instr(definition, instr);
            return;
        }

        if (string_equal(token->content, "@assert-not-equal")) {
            struct instr_t instr = {
                .op = OP_ASSERT_NOT_EQUAL,
                .assert.token = token,
            };
            function_definition_append_instr(definition, instr);
            return;
        }

        compile_word(vm, definition, token->content);
        token_free(token);
        return;
    }

    case STRING_TOKEN: {
        TODO();
        token_free(token);
        return;
    }

    case INT_TOKEN: {
        struct instr_t instr = {
            .op = OP_LITERAL_INT,
            .literal_int.content = string_parse_int(token->content),
        };
        token_free(token);
        function_definition_append_instr(definition, instr);
        return;
    }

    case FLOAT_TOKEN: {
        struct instr_t instr = {
            .op = OP_LITERAL_FLOAT,
            .literal_float.content = string_parse_double(token->content),
        };
        token_free(token);
        function_definition_append_instr(definition, instr);
        return;
    }

    case BRACKET_START_TOKEN: {
        assert(string_equal(token->content, "["));
        token_free(token);
        compile_bindings(vm, definition, "]");
        return;
    }

    case BRACKET_END_TOKEN: {
        token_free(token);
        who_printf("missing BRACKET_START_TOKEN: %s\n", token->content);
        assert(false);
    }

    case QUOTATION_MARK_TOKEN: {
        TODO();
        token_free(token);
        return;
    }

    case KEYWORD_TOKEN: {
        TODO();
        token_free(token);
        return;
    }

    case HASHTAG_TOKEN: {
        TODO();
        token_free(token);
        return;
    }

    case LINE_COMMENT_TOKEN: {
        token_free(token);
        return;
    }
    }
}

struct op_word_entry_t { const char *word; op_t op; };

static struct op_word_entry_t op_word_entries[] = {
    { "iadd", OP_IADD },
    { "isub", OP_ISUB },
    { "imul", OP_IMUL },
    { "idiv", OP_IDIV },
    { "imod", OP_IMOD },
    { "fadd", OP_FADD },
    { "fsub", OP_FSUB },
    { "fmul", OP_FMUL },
    { "fdiv", OP_FDIV },
    { "fmod", OP_FMOD },
    { "@dup", OP_DUP },
    { "@drop", OP_DROP },
    { "@swap", OP_SWAP },
};

static size_t
get_op_word_entry_count(void) {
    return sizeof op_word_entries / sizeof(struct op_word_entry_t);
}

static bool
is_op_word(const char *word) {
    for (size_t i = 0; i < get_op_word_entry_count(); i++) {
        struct op_word_entry_t op_word_entry = op_word_entries[i];
        if (string_equal(op_word_entry.word, word)) {
            return true;
        }
    }

    return false;
}

static void
compile_op_word(definition_t *definition, const char *word) {
    assert(is_op_word(word));

    for (size_t i = 0; i < get_op_word_entry_count(); i++) {
        struct op_word_entry_t op_word_entry = op_word_entries[i];
        if (string_equal(op_word_entry.word, word)) {
            struct instr_t instr = { .op = op_word_entry.op };
            function_definition_append_instr(definition, instr);
        }
    }
}

static void
compile_word(vm_t *vm, definition_t *definition, const char *word) {
    if (string_equal(word, "@return")) {
        compile_return(definition);
        return;
    }

    if (string_equal(word, "@tail-call")) {
        compile_tail_call(vm, definition);
        return;
    }

    if (is_op_word(word)) {
        compile_op_word(definition, word);
        return;
    }

    compile_invoke(vm, definition, word);
    return;
}

static void
compile_invoke(vm_t *vm, definition_t *definition, const char *name) {
    if (function_definition_has_binding_index(definition, name)) {
        size_t index = function_definition_get_binding_index(definition, name);
        struct instr_t instr = {
            .op = OP_LOCAL_LOAD,
            .local_load.index = index,
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    definition_t *found = mod_lookup(vm->mod, name);
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
    assert(found->kind == PRIMITIVE_DEFINITION ||
           found->kind == FUNCTION_DEFINITION);

    struct instr_t instr = {
        .op = OP_TAIL_CALL,
        .tail_call.definition = found,
    };
    function_definition_append_instr(definition, instr);
}

static void
compile_local_store_stack(definition_t *definition, stack_t *local_name_stack) {
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
            compile_local_store_stack(definition, local_name_stack);
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
            compile_local_store_stack(definition, local_name_stack);
            return;
        }

        assert(token->kind == SYMBOL_TOKEN);
        stack_push(local_name_stack, string_copy(token->content));
        function_definition_add_binding(definition, token->content);
        token_free(token);
    }

    compile_local_store_stack(definition, local_name_stack);
}
