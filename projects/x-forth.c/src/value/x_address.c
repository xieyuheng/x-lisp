#include "index.h"

value_t
x_address(void *pointer) {
    return (value_t) ((uint64_t) pointer | X_ADDRESS);
}

bool
address_p(value_t value) {
    return value_tag(value) == X_ADDRESS;
}

uint64_t
to_address(value_t value) {
    assert(address_p(value));
    return ((uint64_t) value & PAYLOAD_MASK);
}

value_0_ary_fn_t *
to_0_ary_fn(value_t value) {
    if (!address_p(value)) {
        who_printf("value is not address:"); value_print(value); printf("\n");
        assert(false && "value is not address");
    }

    return (value_0_ary_fn_t *) to_address(value);
}

// value_1_ary_fn_t *
// to_1_ary_fn(value_t value) {
//     assert(address_p(value));
//     return (value_1_ary_fn_t *) to_address(value);
// }

value_1_ary_fn_t *
to_1_ary_fn(value_t value) {
    if (!address_p(value)) {
        who_printf("value is not address:"); value_print(value); printf("\n");
        assert(false && "value is not address");
    }

    return (value_1_ary_fn_t *) to_address(value);
}

value_2_ary_fn_t *
to_2_ary_fn(value_t value) {
    assert(address_p(value));
    return (value_2_ary_fn_t *) to_address(value);
}

value_3_ary_fn_t *
to_3_ary_fn(value_t value) {
    assert(address_p(value));
    return (value_3_ary_fn_t *) to_address(value);
}

value_4_ary_fn_t *
to_4_ary_fn(value_t value) {
    assert(address_p(value));
    return (value_4_ary_fn_t *) to_address(value);
}

value_5_ary_fn_t *
to_5_ary_fn(value_t value) {
    assert(address_p(value));
    return (value_5_ary_fn_t *) to_address(value);
}

value_6_ary_fn_t *
to_6_ary_fn(value_t value) {
    assert(address_p(value));
    return (value_6_ary_fn_t *) to_address(value);
}
