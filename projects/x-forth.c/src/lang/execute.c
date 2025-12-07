#include "index.h"

static void
execute_token(vm_t *vm, token_t *token) {
    if (token->kind == SYMBOL_TOKEN) {
        definition_t *definition = mod_lookup(vm->mod, token->content);
        invoke(vm, definition);
    }
}

static void
invoke(vm_t *vm, definition_t *definition) {
    switch (definition->kind) {
    case FUNCTION_DEFINITION:
        // TODO
        break;
    case PRIMITIVE_DEFINITION:
        // TODO
        break;
    case VARIABLE_DEFINITION:
        // TODO
        break;
    case CONSTANT_DEFINITION:
        // TODO
        break;
    }
}

void
execute(vm_t *vm) {
    while (!list_is_empty(vm->tokens)) {
        execute_token(vm, list_first(vm->tokens));
    }
}
