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
    assert(list_length(tokens) >= 2);
    line_t *line = make_line(tokens);
    lexer_free(lexer);
    return line;
}

const char *
line_op_name(line_t *self) {
    token_t *token = list_get(self->tokens, 0);
    assert(token->kind == SYMBOL_TOKEN);
    return token->content;
}

path_t *
line_path(line_t *self) {
    token_t *token = list_get(self->tokens, 1);
    assert(token->kind == SYMBOL_TOKEN);
    return make_path(token->content);
}

void
line_print(line_t *self) {
    string_print(line_op_name(self));
    string_print(" ");
    path_print(line_path(self));
    newline();
}
