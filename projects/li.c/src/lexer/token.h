#pragma once


typedef enum {
    SYMBOL_TOKEN,
    STRING_TOKEN,
    INT_TOKEN,
    FLOAT_TOKEN,
    BRACKET_START_TOKEN,
    BRACKET_END_TOKEN,
    QUOTATION_MARK_TOKEN,
    KEYWORD_TOKEN,
    LINE_COMMENT_TOKEN,
} token_kind_t;

struct token_t {
    token_kind_t kind;
    char *content;
    struct span_t span;
};

token_t *make_token(token_kind_t kind, char *content, struct span_t span);
void token_free(token_t *self);
