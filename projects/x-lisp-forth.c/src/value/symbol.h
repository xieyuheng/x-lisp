#pragma once

struct symbol_t {
    char *string;
};

symbol_t *intern_symbol(const char *string);
void symbol_free(symbol_t *self);

const char *symbol_string(const symbol_t *self);
size_t symbol_length(const symbol_t *self);
