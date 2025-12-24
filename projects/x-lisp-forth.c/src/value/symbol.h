#pragma once

struct symbol_t {
    char *string;
};

symbol_t *intern_symbol(const char *string);
