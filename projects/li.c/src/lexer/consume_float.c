#include "index.h"

bool
can_consume_float(lexer_t *lexer) {
    char *word = lexer_next_word_string(lexer);
    bool result = string_is_double(word);
    string_free(word);
    return result;
}

char *
consume_float(lexer_t *lexer) {
    char *word = lexer_next_word_string(lexer);
    lexer_forward(lexer, string_length(word));
    return word;
}
