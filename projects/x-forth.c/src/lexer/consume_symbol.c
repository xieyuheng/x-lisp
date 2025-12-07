#include "index.h"

bool
can_consume_symbol(lexer_t *lexer) {
    if (char_is_digit(lexer_next_char(lexer))) return false;
    return true;
}

// char *
// consume_symbol(lexer_t *lexer) {
//     string_builder_t *builder = make_string_builder();
//
//     lexer_forward(lexer, 1);
//
//     char *content = string_builder_produce(builder);
//     string_builder_free(builder);
//     return content;
// }
