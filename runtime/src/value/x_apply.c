#include "index.h"

value_t
x_apply_nullary(value_t target) {
    if (curry_p(target)) {
        curry_t *curry = to_curry(target);
        assert(curry->arity == 0);
        return to_0_ary_fn(curry->target)();
    }

    who_printf("can not apply target\n");
    printf("   target: "); value_print(target, stdout); printf("\n");
    assert(false && "can not apply target");
}

static value_t
call_with_extra_arg(value_t target, size_t arity, value_t *args, value_t extra_arg) {
    assert(arity > 0);

    if (arity == 1)
        return to_1_ary_fn(target)(extra_arg);
    if (arity == 2)
        return to_2_ary_fn(target)(args[0], extra_arg);
    if (arity == 3)
        return to_3_ary_fn(target)(args[0], args[1], extra_arg);
    if (arity == 4)
        return to_4_ary_fn(target)(args[0], args[1], args[2], extra_arg);
    if (arity == 5)
        return to_5_ary_fn(target)(args[0], args[1], args[2], args[3], extra_arg);
    if (arity == 6)
        return to_6_ary_fn(target)(args[0], args[1], args[2], args[3], args[4], extra_arg);

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
            return x_object((object_t *) new_curry);
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
