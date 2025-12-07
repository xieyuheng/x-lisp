#include "index.h"

bool
can_consume_bracket_end(lexer_t *lexer) {
    return lexer_char_is_bracket_end(lexer_next_char(lexer));
}

char *
consume_bracket_end(lexer_t *lexer) {
    char *content = string_slice(
        lexer->string,
        lexer->position.index,
        lexer->position.index + 1);
    lexer_forward(lexer, 1);
    return content;
}
