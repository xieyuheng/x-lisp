#include "index.h"

vm_t *
make_vm(void) {
    vm_t *self = new(vm_t);
    self->value_stack = make_stack();
    self->frame_stack = make_stack();
    return self;
}
