#pragma once

typedef void (x_fn_t)(vm_t *vm);
typedef value_t (x_fn_0_t)(void);
typedef value_t (x_fn_1_t)(value_t x1);
typedef value_t (x_fn_2_t)(value_t x1, value_t x2);
typedef value_t (x_fn_3_t)(value_t x1, value_t x2, value_t x3);
typedef value_t (x_fn_4_t)(value_t x1, value_t x2, value_t x3, value_t x4);
typedef value_t (x_fn_5_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5);
typedef value_t (x_fn_6_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5, value_t x6);

typedef enum {
    X_FN,
    X_FN_0,
    X_FN_1,
    X_FN_2,
    X_FN_3,
    X_FN_4,
    X_FN_5,
    X_FN_6,
} x_fn_kind_t;

struct primitive_t {
    x_fn_kind_t fn_kind;
    union {
        x_fn_t *fn;
        x_fn_0_t *fn_0;
        x_fn_1_t *fn_1;
        x_fn_2_t *fn_2;
        x_fn_3_t *fn_3;
        x_fn_4_t *fn_4;
        x_fn_5_t *fn_5;
        x_fn_6_t *fn_6;
    };
    size_t arity;
};

primitive_t *make_primitive(size_t arity, x_fn_t *fn);
primitive_t *make_primitive_0(x_fn_0_t *fn_0);
primitive_t *make_primitive_1(x_fn_1_t *fn_1);
primitive_t *make_primitive_2(x_fn_2_t *fn_2);
primitive_t *make_primitive_3(x_fn_3_t *fn_3);
primitive_t *make_primitive_4(x_fn_4_t *fn_4);
primitive_t *make_primitive_5(x_fn_5_t *fn_5);
primitive_t *make_primitive_6(x_fn_6_t *fn_6);

void primitive_free(primitive_t *self);
