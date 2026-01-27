#include "index.h"

static void interpret_token(vm_t *vm, token_t *token);

void
load_stage1(vm_t *vm) {
    while (!vm_no_more_tokens(vm)) {
        token_t *token = vm_next_token(vm);
        interpret_token(vm, token);
    }
}

static void
interpret_token(vm_t *vm, token_t *token) {
    switch (token->kind) {
    case LINE_COMMENT_TOKEN: {
        token_free(token);
        return;
    }

    case SYMBOL_TOKEN: {
        x_fn_t *handler = find_stmt_handler(token->content);
        if (handler) {
            handler(vm);
            token_free(token);
            return;
        }

        who_printf("unhandled top-level symbol: %s\n", token->content);
        token_free(token);
        return;
    }

    default: {
        who_printf("unhandled top-level token: %s\n", token->content);
        return;
    }
    }
}
