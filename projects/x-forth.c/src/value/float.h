#pragma once

value_t x_float(double target);
bool float_p(value_t value);
double to_double(value_t value);

value_t x_float_p(value_t x);
value_t x_fneg(value_t x);
value_t x_fadd(value_t x, value_t y);
value_t x_fsub(value_t x, value_t y);
value_t x_fmul(value_t x, value_t y);
value_t x_fdiv(value_t x, value_t y);
value_t x_fmod(value_t x, value_t y);
value_t x_float_max(value_t x, value_t y);
value_t x_float_min(value_t x, value_t y);
value_t x_float_greater_p(value_t x, value_t y);
value_t x_float_less_p(value_t x, value_t y);
value_t x_float_greater_or_equal_p(value_t x, value_t y);
value_t x_float_less_or_equal_p(value_t x, value_t y);
value_t x_float_positive_p(value_t x);
value_t x_float_non_negative_p(value_t x);
value_t x_float_non_zero_p(value_t x);
value_t x_float_compare_ascending(value_t x, value_t y);
value_t x_float_compare_descending(value_t x, value_t y);
value_t x_float_to_int(value_t x);
