#include "index.h"

void
apply_n(vm_t *vm, const definition_t *definition, size_t n) {
    switch (definition->kind) {
    case PRIMITIVE_DEFINITION: {
        (void) vm;
        (void) n;
        return;
    }

    case FUNCTION_DEFINITION: {
        (void) vm;
        (void) n;
        return;
    }

    default: {
        who_printf("can not apply definition: %s\n", definition->name);
        exit(1);
    }
    }
}
