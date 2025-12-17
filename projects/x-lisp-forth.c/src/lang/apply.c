#include "index.h"

void
apply(vm_t *vm, size_t n, value_t target) {
    if (object_p(target)) {
        object_t *object = to_object(target);
        if (object->spec == &definition_object_spec) {
            apply_definition(vm, n, (definition_t *) object);
            return;
        } else {
            who_printf("can not apply object: "); value_print(target); printf("\n");
            exit(1);
        }
    }

    who_printf("can not apply value: "); value_print(target); printf("\n");
    exit(1);
}

void
apply_definition(vm_t *vm, size_t n, const definition_t *definition) {
    if (!definition_has_arity(definition)) {
        who_printf("definition has no arity: %s\n", definition->name);
        exit(1);
    }

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
