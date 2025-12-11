#include "index.h"

static void
compile_token(vm_t *vm, definition_t *definition, token_t *token) {
    (void) vm;

    switch (token->kind) {
    case SYMBOL_TOKEN: {
        TODO();
        return;
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
        TODO();
        return;
    }

    case BRACKET_END_TOKEN: {
        TODO();
        return;
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

void
compile_function(vm_t *vm, definition_t *definition) {
    assert(definition->kind == FUNCTION_DEFINITION);
    while (true) {
        if (list_is_empty(vm->tokens)) {
            who_printf("missing @end");
            assert(false);
        }

        token_t *token = list_shift(vm->tokens);
        if (token->kind == SYMBOL_TOKEN &&
            string_equal(token->content, "@end"))
        {
            token_free(token);
            return;
        } else {
            compile_token(vm, definition, token);
            token_free(token);
        }
    }
}
