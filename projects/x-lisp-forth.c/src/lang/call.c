#include "index.h"

inline void
call(vm_t *vm, const definition_t *definition) {
    switch (definition->kind) {
    case PRIMITIVE_DEFINITION: {
        call_primitive(vm, definition->primitive_definition.primitive);
        return;
    }

    case FUNCTION_DEFINITION: {
        stack_push(vm->frame_stack, make_frame(definition));
        return;
    }

    case VARIABLE_DEFINITION: {
        value_t value = definition->variable_definition.value;
        stack_push(vm->value_stack, value);
        return;
    }

    case CONSTANT_DEFINITION: {
        value_t value = definition->constant_definition.value;
        stack_push(vm->value_stack, value);
        return;
    }
    }
}

inline void
call_primitive(vm_t *vm, const primitive_t *primitive) {
    switch (primitive->fn_kind) {
    case X_FN: {
        primitive->fn(vm);
        return;
    }

    case X_FN_0: {
        value_t result = primitive->fn_0();
        stack_push(vm->value_stack, result);
        return;
    }

    case X_FN_1: {
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_1(x1);
        stack_push(vm->value_stack, result);
        return;
    }

    case X_FN_2: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_2(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case X_FN_3: {
        value_t x3 = stack_pop(vm->value_stack);
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_3(x1, x2, x3);
        stack_push(vm->value_stack, result);
        return;
    }

    case X_FN_4: {
        value_t x4 = stack_pop(vm->value_stack);
        value_t x3 = stack_pop(vm->value_stack);
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_4(x1, x2, x3, x4);
        stack_push(vm->value_stack, result);
        return;
    }

    case X_FN_5: {
        value_t x5 = stack_pop(vm->value_stack);
        value_t x4 = stack_pop(vm->value_stack);
        value_t x3 = stack_pop(vm->value_stack);
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_5(x1, x2, x3, x4, x5);
        stack_push(vm->value_stack, result);
        return;
    }

    case X_FN_6: {
        value_t x6 = stack_pop(vm->value_stack);
        value_t x5 = stack_pop(vm->value_stack);
        value_t x4 = stack_pop(vm->value_stack);
        value_t x3 = stack_pop(vm->value_stack);
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_6(x1, x2, x3, x4, x5, x6);
        stack_push(vm->value_stack, result);
        return;
    }
    }
}
