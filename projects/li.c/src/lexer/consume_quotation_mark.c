#include "index.h"

bool
can_consume_quotation_mark(lexer_t *lexer) {
    return lexer_char_is_quotation_mark(lexer, lexer_next_char(lexer));
}

char *
consume_quotation_mark(lexer_t *lexer) {
    char *content = lexer_next_char_string(lexer);
    lexer_forward(lexer, 1);
    return content;
}
