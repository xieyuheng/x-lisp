#pragma once

struct vm_t {
    stack_t *value_stack;
    stack_t *frame_stack;
};

vm_t *make_vm(void);
