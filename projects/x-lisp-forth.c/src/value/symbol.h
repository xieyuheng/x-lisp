#pragma once

struct symbol_t {
    char *string;
};

symbol_t *intern_symbol(const char *string);
void symbol_free(symbol_t *self);

const char *symbol_string(const symbol_t *self);
size_t symbol_length(const symbol_t *self);

value_t x_symbol(symbol_t *target);
bool symbol_p(value_t value);
symbol_t *to_symbol(value_t value);
