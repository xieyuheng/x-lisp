#pragma once

typedef void (object_print_fn_t)(object_t *object);
typedef bool (object_same_fn_t)(object_t *lhs, object_t *rhs);
typedef bool (object_equal_fn_t)(object_t *lhs, object_t *rhs);

struct object_spec_t {
    const char *name;
    object_print_fn_t *print_fn;
    object_same_fn_t *same_fn; // for immutable object (like string).
    object_equal_fn_t *equal_fn;
};

struct object_t {
    const object_spec_t *spec;
};

value_t x_object(object_t *target);
bool object_p(value_t value);
object_t *to_object(value_t value);
