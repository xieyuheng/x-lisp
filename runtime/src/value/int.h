#pragma once

value_t x_int(int64_t target);
bool int_p(value_t value);
int64_t to_int64(value_t value);

value_t x_int_p(value_t x);
value_t x_iadd(value_t x, value_t y);
value_t x_isub(value_t x, value_t y);
value_t x_imul(value_t x, value_t y);
value_t x_idiv(value_t x, value_t y);
value_t x_imod(value_t x, value_t y);
value_t x_int_to_float(value_t x);
