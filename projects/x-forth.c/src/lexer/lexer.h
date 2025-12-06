#pragma once

#define MAX_TOKEN_LENGTH 1024

struct lexer_t {
    const char *string;
    size_t length;
    struct position_t position;
    char *buffer;
    size_t buffer_length;
};

lexer_t *make_lexer(const char *string);
void lexer_free(lexer_t *self);

void lexer_lex(lexer_t *self, list_t *tokens);
list_t *lex(const char *string);
