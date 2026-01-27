#include "index.h"

bool
can_consume_symbol(lexer_t *lexer) {
    if (char_is_digit(lexer_next_char(lexer))) return false;
    return true;
}

char *
consume_symbol(lexer_t *lexer) {
    string_builder_t *builder = make_string_builder();

    while (!lexer_is_finished(lexer) &&
           !char_is_space(lexer_next_char(lexer)) &&
           !lexer_char_is_mark(lexer, lexer_next_char(lexer)))
    {
        string_builder_append_char(builder, lexer_next_char(lexer));
        lexer_forward(lexer, 1);
    }

    char *content = string_builder_produce(builder);
    string_builder_free(builder);
    return content;
}
