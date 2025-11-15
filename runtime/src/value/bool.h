#pragma once

#define x_true ((value_t) 0x00ffffffffffffff)
#define x_false ((value_t) 0x01ffffffffffffff)

value_t x_bool(bool target);
bool x_bool_p(value_t value);
bool to_bool(value_t value);

value_t x_not(value_t x);
