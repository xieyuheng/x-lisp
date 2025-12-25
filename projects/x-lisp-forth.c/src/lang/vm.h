#pragma once

struct vm_t {
    mod_t *mod;
    list_t *tokens;
    stack_t *value_stack;
    stack_t *frame_stack;
};

vm_t *make_vm(mod_t *mod, list_t *tokens);
void vm_free(vm_t *self);

mod_t *vm_mod(const vm_t *self);

value_t vm_pop(vm_t *vm);
void vm_push(vm_t *vm, value_t value);

token_t *vm_next_token(vm_t *vm);
bool vm_no_more_tokens(vm_t *vm);

void vm_interpret(vm_t *vm);

void vm_execute_instr(vm_t *vm, frame_t *frame, struct instr_t instr);
void vm_execute_step(vm_t *vm);
void vm_execute(vm_t *vm);
void vm_execute_until(vm_t *vm, size_t base_length);

void vm_perform_gc(vm_t *vm);
