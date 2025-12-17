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
apply_definition(vm_t *vm, size_t n, definition_t *definition) {
    if (!definition_has_arity(definition)) {
        who_printf("definition has no arity: %s\n", definition->name);
        exit(1);
    }

    size_t arity = definition_arity(definition);
    if (n == arity) {
        call_definition(vm, definition);
        return;
    } else if (n < arity) {
        curry_t *curry = make_curry(x_object(definition), arity - n, n);
        for (size_t i = 0; i < n; i++) {
            curry->args[n - i - 1] = stack_pop(vm->value_stack);
        }

        stack_push(vm->value_stack, x_object(curry));
        return;
    } else {
        uint8_t *code = make_code(2, (struct instr_t[]) {
                { .op = OP_LITERAL_INT,
                  .literal_int.content = n - arity },
                { .op = OP_TAIL_APPLY },
            });
        stack_push(vm->frame_stack, make_frame_from_code(code));
        call_definition(vm, definition);
        return;
    }
}
