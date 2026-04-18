#include "index.h"

struct line_t {
    char *op_name;
    path_t *path;
    array_t *args;
};

line_t *
make_line(char *op_name, path_t *path, array_t *args) {
    line_t *self = new(line_t);
    self->op_name = op_name;
    self->path = path;
    self->args = args;
    return self;
}

void
line_free(line_t *self) {
    string_free(self->op_name);
    path_free(self->path);
    array_free(self->args);
    free(self);
}

// static value_t
// parse_line_arg(line_t *self, list_t *tokens, size_t i) {
//     token_t *token = list_get(tokens, 1);
//     switch (token->kind) {
//     case SYMBOL_TOKEN: {
//     }

//     case STRING_TOKEN: {
//     }

//     case INT_TOKEN: {
//     }

//     case FLOAT_TOKEN: {
//     }

//     case QUOTATION_MARK_TOKEN: {
//     }

//     case KEYWORD_TOKEN: {
//     }

//     default: {
//         who_printf("unhandled token: %s\n", token->content);
//         exit(1);
//     }
//     }
// }

line_t *
parse_line(const char *string) {
    lexer_t *lexer = make_lexer(string);
    list_t *tokens = lexer_lex(lexer);
    assert(list_length(tokens) >= 2);

    token_t *token = list_shift(tokens);
    assert(token->kind == SYMBOL_TOKEN);
    char *op_name = string_copy(token->content);
    token_free(token);

    token = list_shift(tokens);
    assert(token->kind == SYMBOL_TOKEN);
    path_t *path = make_path(token->content);
    token_free(token);

    array_t *args = make_array();

    line_t *line = make_line(op_name, path, args);
    lexer_free(lexer);
    list_free(tokens);
    return line;
}

const char *
line_op_name(line_t *self) {
    return self->op_name;
}

const path_t *
line_path(line_t *self) {
    return self->path;
}

void
line_print(line_t *self) {
    string_print(line_op_name(self));
    string_print(" ");
    path_print(line_path(self));
    newline();
}
