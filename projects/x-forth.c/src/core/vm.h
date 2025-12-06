#pragma once

struct vm_t {
    mod_t *mod;
    list_t *tokens;
    stack_t *value_stack;
    stack_t *frame_stack;
};

vm_t *make_vm(mod_t *mod);
void vm_free(vm_t *self);
