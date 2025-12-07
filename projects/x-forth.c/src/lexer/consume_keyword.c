#include "index.h"

bool
can_consume_keyword(lexer_t *lexer) {
    if (lexer_next_char(lexer) != ':') return false;
    char *word = lexer_next_word_string(lexer);
    bool result = string_length(word) > 1;
    return result;
}

char *
consume_keyword(lexer_t *lexer) {
    lexer_forward(lexer, 1);
    return consume_symbol(lexer);
}
