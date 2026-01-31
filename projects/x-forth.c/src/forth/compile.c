#include "index.h"

static void compile_return(function_t *function);
static bool is_op_word(const char *word);
static void compile_op_word(function_t *function, const char *word);
static void compile_token(vm_t *vm, function_t *function, token_t *token);
static void compile_quote(vm_t *vm, function_t *function);
static void compile_call(vm_t *vm, function_t *function, const char *name);
static void compile_ref(vm_t *vm, function_t *function);
static void compile_tail_call(vm_t *vm, function_t *function);
static void compile_parameters(vm_t *vm, function_t *function, const char *end_word);
static void compile_bindings(vm_t *vm, function_t *function, const char *end_word);
static void compile_if(vm_t *vm, function_t *function, const char *else_word, const char *then_word, struct token_meta_t meta);
static void compile_else(vm_t *vm, function_t *function, size_t else_index, const char *then_word, struct token_meta_t meta);

void
compile_function(vm_t *vm, function_t *function) {
    while (true) {
        if (vm_no_more_tokens(vm)) {
            who_printf("missing @end\n");
            exit(1);
        }

        token_t *token = vm_next_token(vm);
        if (string_equal(token->content, "@end")) {
            compile_return(function);
            token_free(token);
            return;
        } else if (string_equal(token->content, "(")) {
            compile_parameters(vm, function, ")");
            token_free(token);
        } else {
            compile_token(vm, function, token);
        }
    }
}

static void
compile_return(function_t *function) {
    struct instr_t instr;
    instr.op = OP_RETURN;
    function_append_instr(function, instr);
}

static void
compile_token(vm_t *vm, function_t *function, token_t *token) {
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        if (string_equal(token->content, "@assert")) {
            struct instr_t instr;
            instr.op = OP_ASSERT;
            instr.assert.token = token;
            function_append_instr(function, instr);
            return;
        }

        if (string_equal(token->content, "@assert-equal")) {
            struct instr_t instr;
            instr.op = OP_ASSERT_EQUAL;
            instr.assert.token = token;
            function_append_instr(function, instr);
            return;
        }

        if (string_equal(token->content, "@assert-not-equal")) {
            struct instr_t instr;
            instr.op = OP_ASSERT_NOT_EQUAL;
            instr.assert.token = token;
            function_append_instr(function, instr);
            return;
        }

        if (string_equal(token->content, "@if")) {
            compile_if(vm, function, "@else", "@then", token->meta);
            token_free(token);
            return;
        }

        if (string_equal(token->content, "@return")) {
            compile_return(function);
            token_free(token);
            return;
        }

        if (string_equal(token->content, "@ref")) {
            compile_ref(vm, function);
            token_free(token);
            return;
        }

        if (string_equal(token->content, "@tail-call")) {
            compile_tail_call(vm, function);
            token_free(token);
            return;
        }

        if (is_op_word(token->content)) {
            compile_op_word(function, token->content);
            token_free(token);
            return;
        }

        compile_call(vm, function, token->content);
        token_free(token);
        return;
    }

    case STRING_TOKEN: {
        struct instr_t instr;
        instr.op = OP_LITERAL;
        instr.literal.value =
            x_object(make_xstring_no_gc(string_copy(token->content)));
        function_append_instr(function, instr);
        token_free(token);
        return;
    }

    case INT_TOKEN: {
        struct instr_t instr;
        instr.op = OP_LITERAL;
        instr.literal.value = x_int(string_parse_int(token->content));
        function_append_instr(function, instr);
        token_free(token);
        return;
    }

    case FLOAT_TOKEN: {
        struct instr_t instr;
        instr.op = OP_LITERAL;
        instr.literal.value = x_float(string_parse_double(token->content));
        function_append_instr(function, instr);
        token_free(token);
        return;
    }

    case BRACKET_START_TOKEN: {
        assert(string_equal(token->content, "("));
        compile_bindings(vm, function, ")");
        token_free(token);
        return;
    }

    case BRACKET_END_TOKEN: {
        token_free(token);
        who_printf("missing BRACKET_START_TOKEN: %s\n", token->content);
        exit(1);
    }

    case QUOTATION_MARK_TOKEN: {
        assert(string_equal(token->content, "'"));
        compile_quote(vm, function);
        token_free(token);
        return;
    }

    case KEYWORD_TOKEN: {
        TODO();
        token_free(token);
        return;
    }

    case HASHTAG_TOKEN: {
        struct instr_t instr;
        instr.op = OP_LITERAL;
        instr.literal.value = x_object(intern_hashtag(token->content));
        function_append_instr(function, instr);
        token_free(token);
        return;
    }

    case LINE_COMMENT_TOKEN: {
        token_free(token);
        return;
    }
    }
}

void
compile_quote(vm_t *vm, function_t *function) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    struct instr_t instr;
    instr.op = OP_LITERAL;
    instr.literal.value = x_object(intern_symbol(token->content));
    function_append_instr(function, instr);
    token_free(token);
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
    { "@assign", OP_ASSIGN_VARIABLE },
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
compile_op_word(function_t *function, const char *word) {
    assert(is_op_word(word));

    for (size_t i = 0; i < get_op_word_entry_count(); i++) {
        struct op_word_entry_t op_word_entry = op_word_entries[i];
        if (string_equal(op_word_entry.word, word)) {
            struct instr_t instr;
            instr.op = op_word_entry.op;
            function_append_instr(function, instr);
        }
    }
}

static void
compile_call(vm_t *vm, function_t *function, const char *name) {
    if (function_has_binding(function, name)) {
        size_t index = function_get_binding_index(function, name);
        struct instr_t instr;
        instr.op = OP_LOCAL_LOAD;
        instr.local.index = index;
        function_append_instr(function, instr);
        return;
    }

    definition_t *found = mod_lookup_or_placeholder(vm_mod(vm), name);
    if (found->kind == PLACEHOLDER_DEFINITION) {
        size_t code_index = function->code_length + 1;
        placeholder_definition_hold_place(found, function, code_index);
    }

    struct instr_t instr;
    instr.op = OP_CALL;
    instr.ref.definition = found;
    function_append_instr(function, instr);
    return;
}

static void
compile_ref(vm_t *vm, function_t *function) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    definition_t *found = mod_lookup_or_placeholder(vm_mod(vm), token->content);
    token_free(token);

    if (found->kind == PLACEHOLDER_DEFINITION) {
        size_t code_index = function->code_length + 1;
        placeholder_definition_hold_place(found, function, code_index);
    }

    struct instr_t instr;
    instr.op = OP_REF;
    instr.ref.definition = found;
    function_append_instr(function, instr);
}

static void
compile_tail_call(vm_t *vm, function_t *function) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    definition_t *found = mod_lookup_or_placeholder(vm_mod(vm), token->content);
    token_free(token);

    if (found->kind == PLACEHOLDER_DEFINITION) {
        size_t code_index = function->code_length + 1;
        placeholder_definition_hold_place(found, function, code_index);
    }

    struct instr_t instr;
    instr.op = OP_TAIL_CALL;
    instr.ref.definition = found;
    function_append_instr(function, instr);
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
compile_parameters(vm_t *vm, function_t *function, const char *end_word) {
    function->parameters = make_string_array();

    stack_t *local_name_stack = make_string_stack();

    while (true) {
        if (vm_no_more_tokens(vm)) {
            who_printf("missing end_word: %s\n", end_word);
            exit(1);
        }

        token_t *token = vm_next_token(vm);
        if (string_equal(token->content, end_word)) {
            token_free(token);
            compile_local_store_stack(function, local_name_stack);
            return;
        }

        assert(token->kind == SYMBOL_TOKEN);
        // different from `compile_bindings`.
        array_push(function->parameters, string_copy(token->content));
        stack_push(local_name_stack, string_copy(token->content));
        function_add_binding(function, token->content);
        token_free(token);
    }
}

static void
compile_bindings(vm_t *vm, function_t *function, const char *end_word) {
    stack_t *local_name_stack = make_string_stack();

    while (true) {
        if (vm_no_more_tokens(vm)) {
            who_printf("missing end_word: %s\n", end_word);
            exit(1);
        }

        token_t *token = vm_next_token(vm);
        if (string_equal(token->content, end_word)) {
            token_free(token);
            compile_local_store_stack(function, local_name_stack);
            return;
        }

        assert(token->kind == SYMBOL_TOKEN);
        stack_push(local_name_stack, string_copy(token->content));
        function_add_binding(function, token->content);
        token_free(token);
    }

    compile_local_store_stack(function, local_name_stack);
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
    function_t *function,
    const char *else_word,
    const char *then_word,
    struct token_meta_t meta
    ) {
    size_t if_index = function->code_length;
    struct instr_t instr;
    instr.op = OP_JUMP_IF_NOT;
    instr.jump.offset = 0;
    function_append_instr(function, instr);

    while (true) {
        if (vm_no_more_tokens(vm)) {
            who_printf("missing then_word: %s\n", then_word);
            token_meta_report(meta);
            exit(1);
        }

        token_t *token = vm_next_token(vm);
        if (string_equal(token->content, then_word)) {
            struct instr_t instr;
            instr.op = OP_JUMP_IF_NOT;
            instr.jump.offset =
                function->code_length -
                if_index - instr_length(instr);
            function_put_instr(function, if_index, instr);
            token_free(token);
            return;
        } else if (string_equal(token->content, else_word)) {
            size_t else_index = function->code_length;
            struct instr_t instr;
            instr.op = OP_JUMP;
            instr.jump.offset = 0;
            function_append_instr(function, instr);

            {
                struct instr_t instr;
                instr.op = OP_JUMP_IF_NOT;
                instr.jump.offset =
                    function->code_length -
                    if_index - instr_length(instr);
                function_put_instr(function, if_index, instr);
            }

            compile_else(vm, function, else_index, then_word, token->meta);
            token_free(token);
            return;
        } else {
            compile_token(vm, function, token);
        }
    }
}

static void
compile_else(
    vm_t *vm,
    function_t *function,
    size_t else_index,
    const char *then_word,
    struct token_meta_t meta
    ) {
    while (true) {
        if (vm_no_more_tokens(vm)) {
            who_printf("missing then_word: %s\n", then_word);
            token_meta_report(meta);
            exit(1);
        }

        token_t *token = vm_next_token(vm);
        if (string_equal(token->content, then_word)) {
            struct instr_t instr;
            instr.op = OP_JUMP;
            instr.jump.offset =
                function->code_length -
                else_index - instr_length(instr);
            function_put_instr(function, else_index, instr);
            token_free(token);
            return;
        }  else {
            compile_token(vm, function, token);
        }
    }
}
