#include "index.h"

// static void
// lexer_init(lexer_t *self) {
//     self->cursor = 0;
//     self->lineno = 1;
//     self->column = 1;
//     self->buffer_length = 0;
// }

// lexer_t *
// make_lexer(void) {
//     lexer_t *self = new(lexer_t);
//     self->buffer = allocate(MAX_TOKEN_LENGTH + 1);
//     self->delimiter_list = make_list();
//     lexer_init(self);
//     return self;
// }

// void
// lexer_free(lexer_t *self) {
//     // keep `token_list` to be collected as return value.
//     free(self->buffer);
//     free(self);
// }
