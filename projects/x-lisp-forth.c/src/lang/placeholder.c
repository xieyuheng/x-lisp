#include "index.h"

struct placeholder_t {
    definition_t *definition;
    size_t code_index;
};

placeholder_t *
make_placeholder(definition_t *definition, size_t code_index) {
    placeholder_t *self = new(placeholder_t);
    self->definition = definition;
    self->code_index = code_index;
    return self;
}

void
placeholder_free(placeholder_t *self) {
    free(self);
}
