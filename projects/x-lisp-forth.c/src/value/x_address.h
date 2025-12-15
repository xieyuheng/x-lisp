#pragma once

value_t x_address(void *pointer);
bool address_p(value_t value);
uint64_t to_address(value_t value);

typedef value_t (value_0_ary_fn_t)(void);
typedef value_t (value_1_ary_fn_t)(value_t x1);
typedef value_t (value_2_ary_fn_t)(value_t x1, value_t x2);
typedef value_t (value_3_ary_fn_t)(value_t x1, value_t x2, value_t x3);
typedef value_t (value_4_ary_fn_t)(value_t x1, value_t x2, value_t x3, value_t x4);
typedef value_t (value_5_ary_fn_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5);
typedef value_t (value_6_ary_fn_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5, value_t x6);

value_0_ary_fn_t *to_0_ary_fn(value_t value);
value_1_ary_fn_t *to_1_ary_fn(value_t value);
value_2_ary_fn_t *to_2_ary_fn(value_t value);
value_3_ary_fn_t *to_3_ary_fn(value_t value);
value_4_ary_fn_t *to_4_ary_fn(value_t value);
value_5_ary_fn_t *to_5_ary_fn(value_t value);
value_6_ary_fn_t *to_6_ary_fn(value_t value);
