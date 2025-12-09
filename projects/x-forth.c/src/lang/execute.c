#include "index.h"

void
execute_token(vm_t *vm, token_t *token) {
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        definition_t *definition = mod_lookup(vm->mod, token->content);
        if (!definition) {
            who_printf("undefined name: %s\n", token->content);
            exit(1);
        }

        invoke(vm, definition);
        return;
    }

    case STRING_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case INT_TOKEN: {
        stack_push(vm->value_stack, x_int(string_parse_int(token->content)));
        return;
    }

    case FLOAT_TOKEN: {
        stack_push(vm->value_stack, x_float(string_parse_double(token->content)));
        return;
    }

    case BRACKET_START_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case BRACKET_END_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case QUOTATION_MARK_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case KEYWORD_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case HASHTAG_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case LINE_COMMENT_TOKEN: {
        return;
    }
    }
}
