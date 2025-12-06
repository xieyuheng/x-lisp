#include "index.h"

lexer_t *
make_lexer(const path_t *path, const char *string) {
    lexer_t *self = new(lexer_t);
    self->path = path;
    self->string = string;
    self->length = string_length(string);
    self->position = (struct position_t) {
        .index = 0,
        .row = 0,
        .column = 0,
    };
    self->buffer = allocate(MAX_TOKEN_LENGTH + 1);
    self->buffer_length = 0;
    return self;
}

void
lexer_free(lexer_t *self) {
    free(self->buffer);
    free(self);
}

void
lexer_lex(lexer_t *self, list_t *tokens) {
    (void) self;
    (void) tokens;
}

list_t *
lex(const path_t *path, const char *string) {
    list_t *tokens = make_list_with((free_fn_t *) token_free);
    lexer_t *lexer = make_lexer(path, string);
    lexer_lex(lexer, tokens);
    return tokens;
}
