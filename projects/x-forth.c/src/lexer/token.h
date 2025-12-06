#pragma once

struct position_t { size_t index, row, column; };

struct span_t { struct position_t start, end; };

struct token_meta_t {
    const path_t *path;
    const char *string;
    struct span_t span;
};

typedef enum {
    SYMBOL,
    STRING,
    INT,
    FLOAT,
    BRACKET_START,
    BRACKET_END,
    QUOTATION_MARK,
    KEYWORD,
    HASHTAG,
} token_kind_t;

struct token_t {
    token_kind_t kind;
    char *string;
    struct token_meta_t meta;
};

// token_t *make_token(char *string, token_kind_t kind, size_t start, size_t end, size_t lineno, size_t column);
// void token_free(token_t *self);
