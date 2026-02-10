#pragma once

vm_t *make_vm(mod_t *mod);
void vm_free(vm_t *self);

mod_t *vm_mod(const vm_t *self);

value_t vm_pop(vm_t *vm);
void vm_push(vm_t *vm, value_t value);

frame_t *vm_top_frame(const vm_t *vm);
void vm_drop_frame(vm_t *vm);
void vm_push_frame(vm_t *vm, frame_t *frame);
size_t vm_frame_count(const vm_t *vm);

void vm_execute(vm_t *vm);

void vm_perform_gc(vm_t *vm);
