#include "index.h"

bool
can_consume_hashtag(lexer_t *lexer) {
    if (lexer_next_char(lexer) != '#') return false;

    char *word = lexer_next_word_string(lexer);
    bool result = string_length(word) > 1;
    string_free(word);
    return result;
}

char *
consume_hashtag(lexer_t *lexer) {
    lexer_forward(lexer, 1);
    return consume_symbol(lexer);
}
