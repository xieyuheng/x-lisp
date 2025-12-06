#pragma once

#define MAX_TOKEN_LENGTH 1024

struct lexer_t {
    const path_t *path;
    const char *string;
    size_t length;
    struct position_t position;
    char *buffer;
    size_t buffer_length;
};

lexer_t *make_lexer(const path_t *path, const char *string);
void lexer_free(lexer_t *self);

bool lexer_is_end(lexer_t *self);
void lexer_forward(lexer_t *self, size_t count);
token_t *lexer_consume(lexer_t *self);
list_t *lex(const path_t *path, const char *string);
