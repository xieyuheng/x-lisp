#include "index.h"

frame_t *
make_frame_from_definition(const definition_t *definition) {
    assert(definition->kind == FUNCTION_DEFINITION);

    frame_t *self = new(frame_t);
    self->definition = definition;
    self->code = definition->function_definition.function->code_area;
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

inline value_t
frame_get_local(frame_t *self, size_t index) {
    return (value_t) array_get(self->locals, index);
}

inline void
frame_put_local(frame_t *self, size_t index, value_t value) {
    array_put(self->locals, index, (void *) value);
}
