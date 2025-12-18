#pragma once

typedef bool (can_consume_fn_t)(lexer_t *lexer);
typedef char *(consume_fn_t)(lexer_t *lexer);

struct consumer_t {
    bool is_ignored;
    token_kind_t kind;
    can_consume_fn_t *can_consume;
    consume_fn_t *consume;
};

extern struct consumer_t consumers[];
size_t consumer_count(void);

bool can_consume_space(lexer_t *); char *consume_space(lexer_t *);
bool can_consume_quotation_mark(lexer_t *); char *consume_quotation_mark(lexer_t *);
bool can_consume_bracket_end(lexer_t *); char *consume_bracket_end(lexer_t *);
bool can_consume_bracket_start(lexer_t *); char *consume_bracket_start(lexer_t *);
bool can_consume_line_comment(lexer_t *); char *consume_line_comment(lexer_t *);
bool can_consume_string(lexer_t *); char *consume_string(lexer_t *);
bool can_consume_float(lexer_t *); char *consume_float(lexer_t *);
bool can_consume_int(lexer_t *); char *consume_int(lexer_t *);
bool can_consume_keyword(lexer_t *); char *consume_keyword(lexer_t *);
bool can_consume_hashtag(lexer_t *); char *consume_hashtag(lexer_t *);
bool can_consume_symbol(lexer_t *); char *consume_symbol(lexer_t *);
