#include "index.h"

vm_t *
make_vm(mod_t *mod, list_t *tokens) {
    vm_t *self = new(vm_t);
    self->mod = mod;
    self->tokens = tokens;
    self->value_stack = make_stack();
    self->frame_stack = make_stack_with((free_fn_t *) frame_free);
    return self;
}

void
vm_free(vm_t *self) {
    list_free(self->tokens);
    stack_free(self->value_stack);
    stack_free(self->frame_stack);
    free(self);
}

void
vm_interpret(vm_t *self) {
    while (!list_is_empty(self->tokens)) {
        token_t *token = list_shift(self->tokens);
        interpret_token(self, token);
    }
}

void
vm_execute_instr(vm_t *self, struct instr_t instr) {
    (void) self;
    (void) instr;
}

void
vm_execute_step(vm_t *self) {
    (void) self;
}

void
vm_execute(vm_t *self) {
    while (true) {
        vm_execute_step(self);
    }
}

void
vm_execute_until(vm_t *self, size_t base_length) {
    while (stack_length(self->frame_stack) > base_length) {
        vm_execute_step(self);
    }
}
