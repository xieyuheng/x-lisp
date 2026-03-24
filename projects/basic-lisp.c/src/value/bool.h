#pragma once

#define x_true  ((value_t) 0b01110)
#define x_false ((value_t) 0b00110)

value_t x_bool(bool target);
bool bool_p(value_t value);
bool true_p(value_t value);
bool false_p(value_t value);
bool to_bool(value_t value);

value_t x_bool_p(value_t x);
value_t x_not(value_t x);
