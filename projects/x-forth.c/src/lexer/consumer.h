#pragma once

typedef bool (can_consume_fn_t)(lexer_t *lexer);
typedef char *(consume_fn_t)(lexer_t *lexer);

struct consumer_t {
    bool is_ignored;
    union {
        token_kind_t kind;
    };
    can_consume_fn_t *can_consume_fn;
    consume_fn_t *consume_fn;
};

extern struct consumer_t consumers[];
