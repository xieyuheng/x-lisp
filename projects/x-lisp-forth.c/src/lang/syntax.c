#include "index.h"

void
syntax_var(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    function_t *function = make_function();
    define_variable_setup(vm_mod(vm), token->content, function);
    compile_function(vm, function);
    token_free(token);
}

void
syntax_def(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    function_t *function = make_function();
    define_function(vm_mod(vm), token->content, function);
    compile_function(vm, function);
    token_free(token);
}
