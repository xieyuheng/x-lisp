#pragma once

tag_t value_tag(value_t value);

bool same_p(value_t lhs, value_t rhs);
bool equal_p(value_t lhs, value_t rhs);

hash_code_t value_hash_code(value_t value);
ordering_t value_total_compare(value_t lhs, value_t rhs);

void value_format(buffer_t *buffer, object_circle_ctx_t *ctx, value_t value);
void format_value(buffer_t *buffer, value_t value);
void print_value(value_t value);
