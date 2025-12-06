#pragma once

typedef bool (can_consume_fn_t)(lexer_t *lexer);
typedef char *(consume_fn_t)(lexer_t *lexer);

struct consumer_t {
    bool is_ignored;
    union {
        token_kind_t kind;
    };
    can_consume_fn_t *can_consume;
    consume_fn_t *consume;
};


bool can_consume_space(lexer_t *); char *consume_space(lexer_t *);
