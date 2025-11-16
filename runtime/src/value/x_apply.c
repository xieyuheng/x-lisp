#include "index.h"

typedef value_t (value_0_ary_fn_t)(void);
typedef value_t (value_1_ary_fn_t)(value_t x1);
typedef value_t (value_2_ary_fn_t)(value_t x1, value_t x2);
typedef value_t (value_3_ary_fn_t)(value_t x1, value_t x2, value_t x3);
typedef value_t (value_4_ary_fn_t)(value_t x1, value_t x2, value_t x3, value_t x4);
typedef value_t (value_5_ary_fn_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5);
typedef value_t (value_6_ary_fn_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5, value_t x6);

static value_0_ary_fn_t *to_0_ary_fn(value_t value) { return (value_0_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
static value_1_ary_fn_t *to_1_ary_fn(value_t value) { return (value_1_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
static value_2_ary_fn_t *to_2_ary_fn(value_t value) { return (value_2_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
static value_3_ary_fn_t *to_3_ary_fn(value_t value) { return (value_3_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
static value_4_ary_fn_t *to_4_ary_fn(value_t value) { return (value_4_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
static value_5_ary_fn_t *to_5_ary_fn(value_t value) { return (value_5_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }
static value_6_ary_fn_t *to_6_ary_fn(value_t value) { return (value_6_ary_fn_t *) ((uint64_t) value & PAYLOAD_MASK); }

value_t
x_apply_nullary(value_t target) {
    return to_0_ary_fn(target)();
}

static value_t
call_with_extra_arg(value_t target, size_t arity, value_t *args, value_t extra_arg) {
    assert(arity > 0);
    if (arity == 1) return to_1_ary_fn(target)(extra_arg);
    if (arity == 2) return to_2_ary_fn(target)(args[0], extra_arg);
    if (arity == 3) return to_3_ary_fn(target)(args[0], args[1], extra_arg);
    if (arity == 4) return to_4_ary_fn(target)(args[0], args[1], args[2], extra_arg);
    if (arity == 5) return to_5_ary_fn(target)(args[0], args[1], args[2], args[3], extra_arg);
    if (arity == 6) return to_6_ary_fn(target)(args[0], args[1], args[2], args[3], args[4], extra_arg);

    who_printf("can not handle arity\n");
    printf("   target: "); value_print(target, stdout); printf("\n");
    printf("   arity: %ld", arity); printf("\n");
    printf("   extra_arg: "); value_print(extra_arg, stdout); printf("\n");
    assert(false && "can not apply target");
}

value_t
x_apply_unary(value_t target, value_t arg) {
    if (curry_p(target)) {
        curry_t *curry = to_curry(target);
        if (curry->arity > 1) {
            size_t new_arity = curry->arity - 1;
            size_t new_size = curry->size + 1;
            curry_t *new_curry = make_curry(curry->target, new_arity, new_size);
            for (size_t i = 0; i < curry->size; i++) {
                new_curry->args[i] = curry->args[i];
            }

            new_curry->args[new_size - 1] = arg;
            return new_curry;
        } else {
            assert(curry->arity == 1);
            return call_with_extra_arg(
                curry->target,
                curry->size + 1,
                curry->args,
                arg);
        }
    }

    who_printf("can not apply target\n");
    printf("   target: "); value_print(target, stdout); printf("\n");
    printf("   arg: "); value_print(arg, stdout); printf("\n");
    assert(false && "can not apply target");
}
