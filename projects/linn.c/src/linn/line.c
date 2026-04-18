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
