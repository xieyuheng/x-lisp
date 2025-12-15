#include "index.h"

frame_t *
make_frame(const definition_t *definition) {
    assert(definition->kind == FUNCTION_DEFINITION);

    frame_t *self = new(frame_t);
    self->definition = definition;
    self->pc = definition->function_definition.code_area;
    self->locals = make_array_auto();
    return self;
}

void
frame_free(frame_t *self) {
    array_free(self->locals);
    free(self);
}
