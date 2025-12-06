#include "index.h"

bool
can_consume_space(lexer_t *lexer) {
    return char_is_space(lexer->string[0]);
}

char *
consume_space(lexer_t *lexer) {
    lexer_forward(lexer, 1);
    return NULL;
}
