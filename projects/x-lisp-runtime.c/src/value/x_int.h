#pragma once

value_t x_int(int64_t target);
bool int_p(value_t value);
int64_t to_int64(value_t value);

value_t x_int_p(value_t x);
value_t x_ineg(value_t x);
value_t x_iadd(value_t x, value_t y);
value_t x_isub(value_t x, value_t y);
value_t x_imul(value_t x, value_t y);
value_t x_idiv(value_t x, value_t y);
value_t x_imod(value_t x, value_t y);
value_t x_int_max(value_t x, value_t y);
value_t x_int_min(value_t x, value_t y);
value_t x_int_greater_p(value_t x, value_t y);
value_t x_int_less_p(value_t x, value_t y);
value_t x_int_greater_or_equal_p(value_t x, value_t y);
value_t x_int_less_or_equal_p(value_t x, value_t y);
value_t x_int_positive_p(value_t x);
value_t x_int_non_negative_p(value_t x);
value_t x_int_non_zero_p(value_t x);
value_t x_int_compare_ascending(value_t x, value_t y);
value_t x_int_compare_descending(value_t x, value_t y);
value_t x_int_to_float(value_t x);
