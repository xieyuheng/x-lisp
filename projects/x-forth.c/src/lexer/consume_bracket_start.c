#include "index.h"

bool
can_consume_bracket_start(lexer_t *lexer) {
    char c = lexer->string[0];
    return c == '(' || c == '[' || c == '{';
}

char *
consume_bracket_start(lexer_t *lexer) {
    char *content = string_slice(
        lexer->string,
        lexer->position.index,
        lexer->position.index + 1);
    lexer_forward(lexer, 1);
    return content;
}
