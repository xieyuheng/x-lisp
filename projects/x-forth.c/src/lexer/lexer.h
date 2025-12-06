#pragma once

#define MAX_TOKEN_LENGTH 1024

struct lexer_t {
    const char *string;
    struct position_t position;
    char *buffer;
    size_t buffer_length;
    list_t *tokens;
};

lexer_t *make_lexer(const char *string);
void lexer_free(lexer_t *self);
