#include "index.h"

static void call_primitive(vm_t *vm, const primitive_t *primitive);

void
invoke(vm_t *vm, definition_t *definition) {
    switch (definition->kind) {
    case FUNCTION_DEFINITION: {
        size_t base_length = stack_length(vm->frame_stack);
        stack_push(vm->frame_stack, make_frame(definition));
        vm_execute_until(vm, base_length);
        break;
    }

    case PRIMITIVE_DEFINITION: {
        call_primitive(vm, definition->primitive_definition.primitive);
        break;
    }

    case VARIABLE_DEFINITION: {
        stack_push(vm->value_stack, definition->variable_definition.value);
        break;
    }

    case CONSTANT_DEFINITION: {
        stack_push(vm->value_stack, definition->variable_definition.value);
        break;
    }
    }
}

static void
call_primitive(vm_t *vm, const primitive_t *primitive) {
    switch (primitive->fn_kind) {
    case PRIMITIVE_FN: {
        primitive->fn(vm);
        return;
    }

    case PRIMITIVE_FN_0: {
        value_t result = primitive->fn_0();
        stack_push(vm->value_stack, result);
        return;
    }

    case PRIMITIVE_FN_1: {
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_1(x1);
        stack_push(vm->value_stack, result);
        return;
    }

    case PRIMITIVE_FN_2: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_2(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case PRIMITIVE_FN_3: {
        value_t x3 = stack_pop(vm->value_stack);
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_3(x1, x2, x3);
        stack_push(vm->value_stack, result);
        return;
    }

    case PRIMITIVE_FN_4: {
        value_t x4 = stack_pop(vm->value_stack);
        value_t x3 = stack_pop(vm->value_stack);
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_4(x1, x2, x3, x4);
        stack_push(vm->value_stack, result);
        return;
    }

    case PRIMITIVE_FN_5: {
        value_t x5 = stack_pop(vm->value_stack);
        value_t x4 = stack_pop(vm->value_stack);
        value_t x3 = stack_pop(vm->value_stack);
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = primitive->fn_5(x1, x2, x3, x4, x5);
        stack_push(vm->value_stack, result);
        return;
    }

    case PRIMITIVE_FN_6: {
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
