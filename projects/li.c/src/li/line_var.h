#pragma once

extern const object_class_t line_var_class;

struct line_var_t {
    struct object_header_t header;
    char *string;
};

line_var_t *intern_line_var(const char *string);
void line_var_free(line_var_t *self);

const char *line_var_string(const line_var_t *self);
size_t line_var_length(const line_var_t *self);

bool line_var_p(value_t value);
line_var_t *to_line_var(value_t value);

void line_var_print(printer_t *printer, const line_var_t *self);
hash_code_t line_var_hash_code(const line_var_t *self);
ordering_t line_var_compare(const line_var_t *lhs, const line_var_t *rhs);
