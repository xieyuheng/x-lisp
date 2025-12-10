#pragma once

struct vm_t {
    mod_t *mod;
    list_t *tokens;
    stack_t *value_stack;
    stack_t *frame_stack;
};

vm_t *make_vm(mod_t *mod, list_t *tokens);
void vm_free(vm_t *self);

void vm_interpret(vm_t *self);

void vm_execute_instr(vm_t *self, struct instr_t instr);
void vm_execute_step(vm_t *self);
void vm_execute(vm_t *self);
void vm_execute_until(vm_t *self, size_t base_length);
