#include "index.h"

vm_t *
make_vm(void) {
    vm_t *self = new(vm_t);
    self->value_stack = make_stack();
    self->frame_stack = make_stack_with((free_fn_t *) frame_free);
    return self;
}

void
vm_free(vm_t *self) {
    stack_free(self->value_stack);
    stack_free(self->frame_stack);
    free(self);
}
