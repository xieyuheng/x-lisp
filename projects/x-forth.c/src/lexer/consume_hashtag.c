#include "index.h"

bool
can_consume_hashtag(lexer_t *lexer) {
    return lexer_next_char(lexer) == '#';
}

char *
consume_hashtag(lexer_t *lexer) {
    lexer_forward(lexer, 1);
    return consume_symbol(lexer);
}
