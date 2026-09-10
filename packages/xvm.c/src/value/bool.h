#pragma once

#define x_true  ((value_t) 0b01110)
#define x_false ((value_t) 0b00110)

value_t x_bool(bool target);
bool is_bool(value_t value);
bool is_true(value_t value);
bool is_false(value_t value);
bool to_bool(value_t value);

value_t x_is_bool(value_t x);
value_t x_not(value_t x);
