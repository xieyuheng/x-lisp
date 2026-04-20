#pragma once

value_t x_immediate(uint64_t target);
bool immediate_p(value_t value);
uint64_t to_immediate_uint64(value_t value);
