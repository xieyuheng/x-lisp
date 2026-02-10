#include "index.h"

value_t
x_assert(value_t value) {
    if (value != x_true) {
        printf("(assert) fail");
        printf("\n  value: "); print(value);
        printf("\n");
        exit(1);
    }

    return x_void;
}

value_t
x_assert_not(value_t value) {
    if (value != x_false) {
        printf("(assert-not) fail");
        printf("\n  value: "); print(value);
        printf("\n");
        exit(1);
    }

    return x_void;
}

value_t
x_assert_equal(value_t lhs, value_t rhs) {
    if (!equal_p(lhs, rhs)) {
        printf("(assert-equal) fail");
        printf("\n  lhs: "); print(lhs);
        printf("\n  rhs: "); print(rhs);
        printf("\n");
        exit(1);
    }

    return x_void;
}

value_t
x_assert_not_equal(value_t lhs, value_t rhs) {
    if (equal_p(lhs, rhs)) {
        printf("(assert-not-equal) fail");
        printf("\n  lhs: "); print(lhs);
        printf("\n  rhs: "); print(rhs);
        printf("\n");
        exit(1);
    }

    return x_void;
}

void
x_the(vm_t *vm) {
    value_t value = vm_pop(vm);
    value_t schema = vm_pop(vm);
    vm_push(vm, value);
    apply(vm, 1, schema);
    value_t result = vm_pop(vm);
    if (true_p(result)) {
        vm_push(vm, value);
    } else {
        printf("(the) fail");
        printf("\n  schema: "); print(schema);
        printf("\n  value: "); print(value);
        printf("\n");
        exit(1);
    }
}
