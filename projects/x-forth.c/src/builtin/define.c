#include "index.h"

void
x_define_constant(vm_t *vm) {
    value_t value = stack_pop(vm->value_stack);
    token_t *token = list_shift(vm->tokens);
    assert(token->kind == SYMBOL_TOKEN);
    define_constant(vm->mod, token->content, value);
    token_free(token);
}

void
x_define_variable(vm_t *vm) {
    (void) vm;
}

void
x_define_function(vm_t *vm) {
    (void) vm;
}
