#include "index.h"

void
x_valid_p(vm_t *vm) {
    value_t value = vm_pop(vm);
    value_t schema = vm_pop(vm);

    if (true_p(x_atom_p(schema))) {
        if (equal_p(schema, value)) {
            vm_push(vm, x_true);
            return;
        } else {
            vm_push(vm, x_false);
            return;
        }
    } else {
        vm_push(vm, value);
        apply(vm, 1, schema);
        value_t result = vm_pop(vm);
        if (true_p(result)) {
            vm_push(vm, x_true);
            return;
        } else {
            vm_push(vm, x_false);
            return;
        }
    }
}
