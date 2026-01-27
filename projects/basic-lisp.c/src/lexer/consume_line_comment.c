#include "index.h"

bool
can_consume_line_comment(lexer_t *lexer) {
    char *word = lexer_next_word_string(lexer);
    bool result = string_equal(word, lexer->line_comment_introducer);
    string_free(word);
    return result;
}

char *
consume_line_comment(lexer_t *lexer) {
    string_builder_t *builder = make_string_builder();

    while (true) {
        if (lexer_is_finished(lexer)) {
            break;
        }

        char c = lexer_next_char(lexer);
        if (c == '\n') {
            lexer_forward(lexer, 1);
            break;
        }

        string_builder_append_char(builder, c);
        lexer_forward(lexer, 1);
    }

    char *content = string_builder_produce(builder);
    string_builder_free(builder);
    return content;
}
