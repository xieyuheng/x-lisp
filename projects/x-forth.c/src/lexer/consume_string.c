#include "index.h"

bool
can_consume_string(lexer_t *lexer) {
    return lexer_next_char(lexer) == '"';
}

char *
consume_string(lexer_t *lexer) {
    lexer_forward(lexer, 1); // over the starting '"'

    string_builder_t *builder = make_string_builder();

    while (lexer_next_char(lexer) != '"') {
        if (lexer_is_finished(lexer)) {
            where_printf("double qouted string mismatch");
            assert(false);
        }

        char c = lexer_next_char(lexer);
        if (c == '\\') {
            lexer_forward(lexer, 1);

            c = lexer_next_char(lexer);
            // escape char from: https://www.json.org/json-en.html
            if (c == 'n') string_builder_append_char(builder, '\n');
            else if (c == 't') string_builder_append_char(builder, '\t');
            else if (c == 'b') string_builder_append_char(builder, '\b');
            else if (c == 'f') string_builder_append_char(builder, '\f');
            else if (c == 'r') string_builder_append_char(builder, '\r');
            else if (c == '0') string_builder_append_char(builder, '\0');
            else if (c == '"') string_builder_append_char(builder, '\"');
            else if (c == '\\') string_builder_append_char(builder, '\\');
            else {
                where_printf("unknown escape char");
                assert(false);
            }

            lexer_forward(lexer, 1);
        } else {
            string_builder_append_char(builder, c);
            lexer_forward(lexer, 1);
        }
    }

    lexer_forward(lexer, 1); // over the ending '"'

    char *content = string_builder_produce(builder);
    string_builder_free(builder);
    return content;
}
