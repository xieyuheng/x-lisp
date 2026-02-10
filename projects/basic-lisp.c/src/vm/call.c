#include "index.h"

inline void
call_definition(vm_t *vm, const definition_t *definition) {
    switch (definition->kind) {
    case PRIMITIVE_DEFINITION: {
        call_primitive(vm, definition->primitive_definition.primitive);
        return;
    }

    case FUNCTION_DEFINITION: {
        call_function(vm, definition_function(definition));
        return;
    }

    case VARIABLE_DEFINITION: {
        unreachable();
    }
    }
}

inline void
call_definition_now(vm_t *vm, const definition_t *definition) {
    switch (definition->kind) {
    case PRIMITIVE_DEFINITION: {
        call_primitive(vm, definition->primitive_definition.primitive);
        return;
    }

    case FUNCTION_DEFINITION: {
        call_function_now(vm, definition_function(definition));
        return;
    }

    case VARIABLE_DEFINITION: {
        unreachable();
    }
    }
}

inline void
call_function(vm_t *vm, const function_t *function) {
    vm_push_frame(vm, make_function_frame(function));
    return;
}

inline void
call_function_now(vm_t *vm, const function_t *function) {
    vm_push_frame(vm, make_break_frame());
    vm_push_frame(vm, make_function_frame(function));
    vm_execute(vm);
    return;
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
        vm_push(vm, result);
        return;
    }

    case X_FN_1: {
        value_t x1 = vm_pop(vm);
        value_t result = primitive->fn_1(x1);
        vm_push(vm, result);
        return;
    }

    case X_FN_2: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = primitive->fn_2(x1, x2);
        vm_push(vm, result);
        return;
    }

    case X_FN_3: {
        value_t x3 = vm_pop(vm);
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = primitive->fn_3(x1, x2, x3);
        vm_push(vm, result);
        return;
    }

    case X_FN_4: {
        value_t x4 = vm_pop(vm);
        value_t x3 = vm_pop(vm);
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = primitive->fn_4(x1, x2, x3, x4);
        vm_push(vm, result);
        return;
    }

    case X_FN_5: {
        value_t x5 = vm_pop(vm);
        value_t x4 = vm_pop(vm);
        value_t x3 = vm_pop(vm);
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = primitive->fn_5(x1, x2, x3, x4, x5);
        vm_push(vm, result);
        return;
    }

    case X_FN_6: {
        value_t x6 = vm_pop(vm);
        value_t x5 = vm_pop(vm);
        value_t x4 = vm_pop(vm);
        value_t x3 = vm_pop(vm);
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = primitive->fn_6(x1, x2, x3, x4, x5, x6);
        vm_push(vm, result);
        return;
    }
    }
}
