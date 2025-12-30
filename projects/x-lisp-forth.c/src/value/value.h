#pragma once

tag_t value_tag(value_t value);

void value_print(value_t value);

bool same_p(value_t lhs, value_t rhs);
bool equal_p(value_t lhs, value_t rhs);

uint64_t value_hash_code(value_t value);
ordering_t value_total_compare(value_t lhs, value_t rhs);

value_t x_any_p(value_t x);
value_t x_same_p(value_t lhs, value_t rhs);
value_t x_equal_p(value_t lhs, value_t rhs);
value_t x_hash_code(value_t value);

void init_constant_values(void);
