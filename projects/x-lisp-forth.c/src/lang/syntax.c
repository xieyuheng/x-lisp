#include "index.h"

void
syntax_var(vm_t *vm) {
    value_t value = vm_pop(vm);
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    define_variable(vm_mod(vm), token->content, value);
    token_free(token);
}

void
syntax_def(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    definition_t *definition = define_function(vm_mod(vm), token->content);
    compile_function(vm, definition);
    token_free(token);
}
