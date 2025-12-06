#pragma once

#define MAX_TOKEN_LENGTH 1024

struct lexer_t {
    const char *string;
    size_t length;

    size_t index;
    size_t row;
    size_t column;

    char *buffer;
    size_t buffer_length;
};

lexer_t *make_lexer(void);
void lexer_free(lexer_t *self);
