#include "index.h"

static void compile_return(definition_t *definition);
static void compile_token(vm_t *vm, definition_t *definition, token_t *token);
static void compile_word(vm_t *vm, definition_t *definition, const char *word);
static void compile_invoke(vm_t *vm, definition_t *definition, const char *name);
static void compile_ref(vm_t *vm, definition_t *definition);
static void compile_tail_call(vm_t *vm, definition_t *definition);
static void compile_parameters(vm_t *vm, definition_t *definition, const char *end_word);
static void compile_bindings(vm_t *vm, definition_t *definition, const char *end_word);
static void compile_if(vm_t *vm, definition_t *definition, const char *else_word, const char *then_word, struct token_meta_t meta);
static void compile_else(vm_t *vm, definition_t *definition, size_t else_index, const char *then_word, struct token_meta_t meta);

void
compile_function(vm_t *vm, definition_t *definition) {
    assert(definition->kind == FUNCTION_DEFINITION);
    while (true) {
        if (list_is_empty(vm->tokens)) {
            who_printf("missing @end\n");
            exit(1);
        }

        token_t *token = list_shift(vm->tokens);
        if (string_equal(token->content, "@end")) {
            token_free(token);
            compile_return(definition);
            return;
        } else if (string_equal(token->content, "@if")) {
            compile_if(vm, definition, "@else", "@then", token->meta);
            token_free(token);
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
    struct instr_t instr;
    instr.op = OP_RETURN;
    function_definition_append_instr(definition, instr);
}

static void
compile_token(vm_t *vm, definition_t *definition, token_t *token) {
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        if (string_equal(token->content, "@assert")) {
            struct instr_t instr;
            instr.op = OP_ASSERT;
            instr.assert.token = token;
            function_definition_append_instr(definition, instr);
            return;
        }

        if (string_equal(token->content, "@assert-equal")) {
            struct instr_t instr;
            instr.op = OP_ASSERT_EQUAL;
            instr.assert_equal.token = token;
            function_definition_append_instr(definition, instr);
            return;
        }

        if (string_equal(token->content, "@assert-not-equal")) {
            struct instr_t instr;
            instr.op = OP_ASSERT_NOT_EQUAL;
            instr.assert_not_equal.token = token;
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
        struct instr_t instr;
        instr.op = OP_LITERAL_INT;
        instr.literal_int.content = string_parse_int(token->content);
        token_free(token);
        function_definition_append_instr(definition, instr);
        return;
    }

    case FLOAT_TOKEN: {
        struct instr_t instr;
        instr.op = OP_LITERAL_FLOAT;
        instr.literal_float.content = string_parse_double(token->content);
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
        exit(1);
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

    { "@apply", OP_APPLY },
    { "@tail-apply", OP_TAIL_APPLY },
    { "@assign", OP_ASSIGN },
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
            struct instr_t instr;
            instr.op = op_word_entry.op;
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

    if (string_equal(word, "@ref")) {
        compile_ref(vm, definition);
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
        struct instr_t instr;
        instr.op = OP_LOCAL_LOAD;
        instr.local_load.index = index;
        function_definition_append_instr(definition, instr);
        return;
    }

    definition_t *found = mod_lookup_or_placeholder(vm->mod, name);
    if (found->kind == PLACEHOLDER_DEFINITION) {
        size_t code_index = definition->function_definition.code_length + 1;
        placeholder_definition_hold_place(found, definition, code_index);
    }

    struct instr_t instr;
    instr.op = OP_CALL;
    instr.call.definition = found;
    function_definition_append_instr(definition, instr);
    return;
}

static void
compile_ref(vm_t *vm, definition_t *definition) {
    token_t *token = list_shift(vm->tokens);
    assert(token->kind == SYMBOL_TOKEN);
    definition_t *found = mod_lookup_or_placeholder(vm->mod, token->content);
    token_free(token);

    if (found->kind == PLACEHOLDER_DEFINITION) {
        size_t code_index = definition->function_definition.code_length + 1;
        placeholder_definition_hold_place(found, definition, code_index);
    }

    struct instr_t instr;
    instr.op = OP_REF;
    instr.ref.definition = found;
    function_definition_append_instr(definition, instr);
}

static void
compile_tail_call(vm_t *vm, definition_t *definition) {
    token_t *token = list_shift(vm->tokens);
    assert(token->kind == SYMBOL_TOKEN);
    definition_t *found = mod_lookup_or_placeholder(vm->mod, token->content);
    token_free(token);

    if (found->kind == PLACEHOLDER_DEFINITION) {
        size_t code_index = definition->function_definition.code_length + 1;
        placeholder_definition_hold_place(found, definition, code_index);
    }

    struct instr_t instr;
    instr.op = OP_TAIL_CALL;
    instr.tail_call.definition = found;
    function_definition_append_instr(definition, instr);
}

static void
compile_local_store_stack(definition_t *definition, stack_t *local_name_stack) {
    while (!stack_is_empty(local_name_stack)) {
        char *name = stack_pop(local_name_stack);
        size_t index = function_definition_get_binding_index(definition, name);
        struct instr_t instr;
        instr.op = OP_LOCAL_STORE;
        instr.local_store.index = index;
        function_definition_append_instr(definition, instr);
    }

    stack_free(local_name_stack);
}

static void
compile_parameters(vm_t *vm, definition_t *definition, const char *end_word) {
    definition->function_definition.parameters = make_string_array_auto();

    stack_t *local_name_stack = make_string_stack();

    while (true) {
        if (list_is_empty(vm->tokens)) {
            who_printf("missing end_word: %s\n", end_word);
            exit(1);
        }

        token_t *token = list_shift(vm->tokens);
        if (string_equal(token->content, end_word)) {
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
compile_bindings(vm_t *vm, definition_t *definition, const char *end_word) {
    stack_t *local_name_stack = make_string_stack();

    while (true) {
        if (list_is_empty(vm->tokens)) {
            who_printf("missing end_word: %s\n", end_word);
            exit(1);
        }

        token_t *token = list_shift(vm->tokens);
        if (string_equal(token->content, end_word)) {
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

// @if ... @then ...
//
//   JUMP_IF_NOT then
//   ...
// then:
//   ...

// @if ... @else ... @then ...
//
//   JUMP_IF_NOT else
//   ...
//   JUMP then
// else:
//   ...
// then:
//   ...

static void
compile_if(
    vm_t *vm,
    definition_t *definition,
    const char *else_word,
    const char *then_word,
    struct token_meta_t meta
) {
    size_t if_index = definition->function_definition.code_length;
    struct instr_t instr;
    instr.op = OP_JUMP_IF_NOT;
    instr.jump_if_not.offset = 0;
    function_definition_append_instr(definition, instr);

    while (true) {
        if (list_is_empty(vm->tokens)) {
            who_printf("missing then_word: %s\n", then_word);
            token_meta_report(meta);
            exit(1);
        }

        token_t *token = list_shift(vm->tokens);
        if (string_equal(token->content, then_word)) {
            struct instr_t instr;
            instr.op = OP_JUMP_IF_NOT;
            instr.jump_if_not.offset =
                definition->function_definition.code_length -
                if_index - instr_length(instr);
            function_definition_put_instr(definition, if_index, instr);
            token_free(token);
            return;
        } else if (string_equal(token->content, else_word)) {
            size_t else_index = definition->function_definition.code_length;
            struct instr_t instr;
            instr.op = OP_JUMP;
            instr.jump.offset = 0;
            function_definition_append_instr(definition, instr);

            {
                struct instr_t instr;
                instr.op = OP_JUMP_IF_NOT;
                instr.jump_if_not.offset =
                    definition->function_definition.code_length -
                    if_index - instr_length(instr);
                function_definition_put_instr(definition, if_index, instr);
            }

            compile_else(vm, definition, else_index, then_word, token->meta);
            token_free(token);
            return;
        } else {
            compile_token(vm, definition, token);
        }
    }
}

static void
compile_else(
    vm_t *vm,
    definition_t *definition,
    size_t else_index,
    const char *then_word,
    struct token_meta_t meta
) {
    while (true) {
        if (list_is_empty(vm->tokens)) {
            who_printf("missing then_word: %s\n", then_word);
            token_meta_report(meta);
            exit(1);
        }

        token_t *token = list_shift(vm->tokens);
        if (string_equal(token->content, then_word)) {
            struct instr_t instr;
            instr.op = OP_JUMP;
            instr.jump.offset =
                definition->function_definition.code_length -
                else_index - instr_length(instr);
            function_definition_put_instr(definition, else_index, instr);
            token_free(token);
            return;
        }  else {
            compile_token(vm, definition, token);
        }
    }
}
