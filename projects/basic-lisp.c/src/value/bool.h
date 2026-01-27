#pragma once

extern value_t x_true;
extern value_t x_false;

value_t x_bool(bool target);
bool bool_p(value_t value);
bool to_bool(value_t value);

value_t x_bool_p(value_t x);
value_t x_not(value_t x);
