#include "index.h"

static void
execute_token(vm_t *vm, token_t *token) {
    (void) vm;
    (void) token;
}

void
execute(vm_t *vm) {
    while (!list_is_empty(vm->tokens)) {
        execute_token(vm, list_first(vm->tokens));
    }
}
