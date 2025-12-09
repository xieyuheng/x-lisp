#include "index.h"

void
execute_token(vm_t *vm, token_t *token) {
    if (token->kind == SYMBOL_TOKEN) {
        definition_t *definition = mod_lookup(vm->mod, token->content);
        if (!definition) {
            who_printf("undefined name: %s\n", token->content);
            exit(1);
        }

        invoke(vm, definition);
    }
}
