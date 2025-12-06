#pragma once

typedef void (primitive_fn_t)(vm_t *vm);
typedef value_t (primitive_fn_0_t)(void);
typedef value_t (primitive_fn_1_t)(value_t x1);
typedef value_t (primitive_fn_2_t)(value_t x1, value_t x2);
typedef value_t (primitive_fn_3_t)(value_t x1, value_t x2, value_t x3);
typedef value_t (primitive_fn_4_t)(value_t x1, value_t x2, value_t x3, value_t x4);
typedef value_t (primitive_fn_5_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5);
typedef value_t (primitive_fn_6_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5, value_t x6);

typedef enum {
    PRIMITIVE_FN,
    PRIMITIVE_FN_0,
    PRIMITIVE_FN_1,
    PRIMITIVE_FN_2,
    PRIMITIVE_FN_3,
    PRIMITIVE_FN_4,
    PRIMITIVE_FN_5,
    PRIMITIVE_FN_6,
} primitive_fn_kind_t;

struct primitive_t {
    char *name;
    primitive_fn_kind_t fn_kind;
    union {
        primitive_fn_t *fn;
        primitive_fn_0_t *fn_0;
        primitive_fn_1_t *fn_1;
        primitive_fn_2_t *fn_2;
        primitive_fn_3_t *fn_3;
        primitive_fn_4_t *fn_4;
        primitive_fn_5_t *fn_5;
        primitive_fn_6_t *fn_6;
    };
};

primitive_t *make_primitive_from_fn(const char *name, primitive_fn_t *fn);
primitive_t *make_primitive_from_fn_0(const char *name, primitive_fn_0_t *fn_0);
primitive_t *make_primitive_from_fn_1(const char *name, primitive_fn_1_t *fn_1);
primitive_t *make_primitive_from_fn_2(const char *name, primitive_fn_2_t *fn_2);
primitive_t *make_primitive_from_fn_3(const char *name, primitive_fn_3_t *fn_3);
primitive_t *make_primitive_from_fn_4(const char *name, primitive_fn_4_t *fn_4);
primitive_t *make_primitive_from_fn_5(const char *name, primitive_fn_5_t *fn_5);
primitive_t *make_primitive_from_fn_6(const char *name, primitive_fn_6_t *fn_6);

void primitive_free(primitive_t *self);
