#pragma once

struct source_location_t {
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
    LINE_COMMENT_TOKEN,
} token_kind_t;

struct token_t {
    token_kind_t kind;
    char *content;
    struct source_location_t location;
};

token_t *make_token(token_kind_t kind, char *content, struct source_location_t location);
void token_free(token_t *self);

void source_location_report(struct source_location_t location);
