#include "index.h"

void
apply(vm_t *vm, size_t n, value_t target) {
    if (definition_p(target)) {
        apply_definition(vm, n, to_definition(target));
    } else if (curry_p(target)) {
        apply_curry(vm, n, to_curry(target));
    } else {
        who_printf("can not apply value: "); print(target); newline();
        exit(1);
    }
}

static void
supply(vm_t *vm, size_t n, value_t target, size_t arity) {
    assert(n < arity);

    curry_t *curry = make_curry(target, arity - n, n);
    for (size_t i = 0; i < n; i++) {
        curry->args[n - i - 1] = vm_pop(vm);
    }

    vm_push(vm, x_object(curry));
}

static void
prepare_to_apply_again(vm_t *vm, size_t n) {
    uint8_t *code = make_code_from_instrs(2, (struct instr_t[]) {
            { .op = OP_LITERAL,
              .literal.value = x_int(n) },
            { .op = OP_TAIL_APPLY },
        });
    vm_push_frame(vm, make_code_frame(code));
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
            stack_push(tmp_stack, (void *) vm_pop(vm));
        }

        for (size_t i = 0; i < curry->size; i++) {
            vm_push(vm, curry->args[i]);
        }

        while (!stack_is_empty(tmp_stack)) {
            vm_push(vm, (value_t) stack_pop(tmp_stack));
        }

        stack_free(tmp_stack);
        apply(vm, n + curry->size, curry->target);
        return;
    } else if (n < curry->arity) {
        supply(vm, n, x_object(curry), curry->arity);
        return;
    } else {
        prepare_to_apply_again(vm, n - curry->arity);
        apply_curry(vm, curry->arity, curry);
        return;
    }
}
