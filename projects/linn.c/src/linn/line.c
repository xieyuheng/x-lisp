#include "index.h"

line_t *
make_line(list_t *tokens) {
    line_t *self = new(line_t);
    self->tokens = tokens;
    return self;
}

void
line_free(line_t *self) {
    list_free(self->tokens);
    free(self);
}
