#include "index.h"

static void
compile_token(vm_t *vm, definition_t *definition, token_t *token) {
    (void) vm;
    (void) definition;
    // function_definition_append_instr(definition, instr);

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
        TODO();
        return;
    }

    case FLOAT_TOKEN: {
        TODO();
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
