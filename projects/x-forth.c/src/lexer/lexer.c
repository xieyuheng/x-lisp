#include "index.h"

lexer_t *
make_lexer(const char *string) {
    lexer_t *self = new(lexer_t);
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

// void
// lexer_free(lexer_t *self) {
//     // keep `token_list` to be collected as return value.
//     free(self->buffer);
//     free(self);
// }
