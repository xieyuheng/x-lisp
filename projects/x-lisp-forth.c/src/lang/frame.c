#include "index.h"

frame_t *
make_frame_from_definition(const definition_t *definition) {
    assert(definition->kind == FUNCTION_DEFINITION);

    frame_t *self = new(frame_t);
    self->definition = definition;
    self->code = definition->function_definition.code_area;
    self->pc = self->code;
    self->locals = make_array();
    return self;
}

frame_t *
make_frame_from_code(uint8_t *code) {
    frame_t *self = new(frame_t);
    self->code = code;
    self->pc = self->code;
    self->locals = make_array();
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
