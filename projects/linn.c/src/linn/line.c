#include "index.h"

line_t *
make_line(list_t *tokens) {
    line_t *self = new(line_t);
    self->tokens = tokens;
    self->args = make_array();
    return self;
}

void
line_free(line_t *self) {
    list_free(self->tokens);
    array_free(self->args);
    free(self);
}

line_t *
parse_line(const char *string) {
    lexer_t *lexer = make_lexer(string);
    list_t *tokens = lexer_lex(lexer);
    line_t *line = make_line(tokens);
    lexer_free(lexer);
    return line;
}

void
line_print(line_t *self) {
    who_printf("hi %p\n", (void *) self);
}
