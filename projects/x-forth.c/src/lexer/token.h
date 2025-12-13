#pragma once

struct token_meta_t {
    const path_t *path;
    const char *string;
    struct span_t span;
};

typedef enum {
    SYMBOL_TOKEN,
    STRING_TOKEN,
    INT_TOKEN,
    FLOAT_TOKEN,
    BRACKET_START_TOKEN,
    BRACKET_END_TOKEN,
    QUOTATION_MARK_TOKEN,
    KEYWORD_TOKEN,
    HASHTAG_TOKEN,
    LINE_COMMENT_TOKEN,
} token_kind_t;

struct token_t {
    token_kind_t kind;
    char *content;
    struct token_meta_t meta;
};

token_t *make_token(token_kind_t kind, char *content, struct token_meta_t meta);
void token_free(token_t *self);

void token_meta_report(struct token_meta_t meta);
