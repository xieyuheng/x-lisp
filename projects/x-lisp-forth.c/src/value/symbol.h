#pragma once

extern const object_class_t symbol_class;

struct symbol_t {
    struct object_header_t header;
    char *string;
};

symbol_t *intern_symbol(const char *string);
void symbol_free(symbol_t *self);

const char *symbol_string(const symbol_t *self);
size_t symbol_length(const symbol_t *self);

bool symbol_p(value_t value);
symbol_t *to_symbol(value_t value);

void symbol_print(const symbol_t *self);
uint64_t symbol_hash_code(const symbol_t *self);
