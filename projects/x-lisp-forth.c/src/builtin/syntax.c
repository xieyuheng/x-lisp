#include "index.h"

void
x_define_constant(vm_t *vm) {
    value_t value = vm_pop(vm);
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    define_constant(vm_mod(vm), token->content, value);
    token_free(token);
}

void
x_define_variable(vm_t *vm) {
    value_t value = vm_pop(vm);
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    define_variable(vm_mod(vm), token->content, value);
    token_free(token);
}

void
x_define_function(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    definition_t *definition = define_function(vm_mod(vm), token->content);
    token_free(token);

    compile_function(vm, definition);
}

void
x_begin(vm_t *vm) {
    char *name = string_copy("@begin (temporary)");
    definition_t *definition = make_function_definition(vm_mod(vm), name);
    compile_function(vm, definition);
    call_definition_now(vm, definition);
    definition_free(definition);
}
