#include "index.h"

frame_t *
make_frame(const definition_t *definition) {
    assert(definition->kind == FUNCTION_DEFINITION);

    frame_t *self = new(frame_t);
    self->definition = definition;
    // self->pc = definition->program;
    self->locals = make_array_auto();
    return self;
}
