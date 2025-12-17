#include "index.h"

void
apply(vm_t *vm, size_t n, value_t target) {
    if (object_p(target)) {
        object_t *object = to_object(target);
        if (object->spec == &definition_object_spec) {
            apply_definition(vm, n, (definition_t *) object);
            return;
        } else if (object->spec == &curry_object_spec) {
            apply_curry(vm, n, (curry_t *) object);
            return;
        } else {
            who_printf("can not apply object: "); value_print(target); printf("\n");
            exit(1);
        }
    }

    who_printf("can not apply value: "); value_print(target); printf("\n");
    exit(1);
}

static void
supply(vm_t *vm, size_t n, value_t target, size_t arity) {
    assert(n < arity);

    curry_t *curry = make_curry(target, arity - n, n);
    for (size_t i = 0; i < n; i++) {
        curry->args[n - i - 1] = stack_pop(vm->value_stack);
    }

    stack_push(vm->value_stack, x_object(curry));
}

static void
prepare_to_apply_again(vm_t *vm, size_t n) {
    uint8_t *code = make_code_from_instrs(2, (struct instr_t[]) {
            { .op = OP_LITERAL_INT,
              .literal_int.content = n },
            { .op = OP_TAIL_APPLY },
        });
    stack_push(vm->frame_stack, make_frame_from_code(code));
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
        supply(vm, n, x_object(definition), arity);
        return;
    } else {
        prepare_to_apply_again(vm, n - arity);
        call_definition(vm, definition);
        return;
    }
}

void
apply_curry(vm_t *vm, size_t n, curry_t *curry) {
    if (n == curry->arity) {
        // curried args are at the front,
        // so we need to save the rest args to `tmp_stack`.

        stack_t *tmp_stack = make_stack();
        for (size_t i = 0; i < n; i++) {
            stack_push(tmp_stack, stack_pop(vm->value_stack));
        }

        for (size_t i = 0; i < curry->size; i++) {
            stack_push(vm->value_stack, curry->args[i]);
        }

        while (!stack_is_empty(tmp_stack)) {
            stack_push(vm->value_stack, stack_pop(tmp_stack));
        }

        stack_free(tmp_stack);
        apply(vm, curry->size, curry->target);
        return;
    } else if (n < curry->arity) {
        supply(vm, n, curry, curry->arity);
        return;
    } else {
        prepare_to_apply_again(vm, n - curry->arity);
        apply_curry(vm, curry->arity, curry);
        return;
    }
}
