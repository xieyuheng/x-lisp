#include "index.h"

value_t
x_function(void *pointer) {
    return (value_t) ((uint64_t) pointer | X_FUNCTION);
}

bool
function_p(value_t value) {
    return value_tag(value) == X_FUNCTION;
}

value_0_ary_fn_t *to_0_ary_fn(value_t value) { return (value_0_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
value_1_ary_fn_t *to_1_ary_fn(value_t value) { return (value_1_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
value_2_ary_fn_t *to_2_ary_fn(value_t value) { return (value_2_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
value_3_ary_fn_t *to_3_ary_fn(value_t value) { return (value_3_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
value_4_ary_fn_t *to_4_ary_fn(value_t value) { return (value_4_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
value_5_ary_fn_t *to_5_ary_fn(value_t value) { return (value_5_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
value_6_ary_fn_t *to_6_ary_fn(value_t value) { return (value_6_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }

// value_t
// x_unary_apply(value_t target, value_t arg) {

// }

value_t
x_nullary_apply(value_t target) {
    return to_0_ary_fn(target)();
}
