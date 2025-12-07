#include "index.h"

bool
can_consume_bracket_end(lexer_t *lexer) {
    char c = lexer_next_char(lexer);
    return c == ')' || c == ']' || c == '}';
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
