#include "index.h"

frame_t *
make_frame(const definition_t *definition) {
    assert(definition->kind == FUNCTION_DEFINITION);

    frame_t *self = new(frame_t);
    self->definition = definition;
    self->code = definition->function_definition.code_area;
    self->pc = self->code;
    self->locals = make_array_auto();
    return self;
}

void
frame_free(frame_t *self) {
    if (!self->definition) {
        free(self->code);
    }

    array_free(self->locals);
    free(self);
}
