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
