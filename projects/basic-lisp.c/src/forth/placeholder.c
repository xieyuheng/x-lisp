#include "index.h"

placeholder_t *
make_placeholder(function_t *function, size_t code_index) {
    placeholder_t *self = new(placeholder_t);
    self->function = function;
    self->code_index = code_index;
    return self;
}

void
placeholder_free(placeholder_t *self) {
    free(self);
}
