#pragma once

struct symbol_t {
    char *string;
};

symbol_t *intern_symbol(const char *string);
void symbol_free(symbol_t *self);
