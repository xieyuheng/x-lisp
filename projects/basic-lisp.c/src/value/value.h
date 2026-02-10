#pragma once

tag_t value_tag(value_t value);

void value_print(printer_t *printer, value_t value);
void print(value_t value);

bool same_p(value_t lhs, value_t rhs);
bool equal_p(value_t lhs, value_t rhs);

hash_code_t value_hash_code(value_t value);
ordering_t value_total_compare(value_t lhs, value_t rhs);

void init_constant_values(void);
