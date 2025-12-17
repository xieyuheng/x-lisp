#pragma once

// - the definition is optional.
// - when there is no definition, the frame owns the pc.

struct frame_t {
    const definition_t *definition;
    uint8_t *code;
    uint8_t *pc;
    array_t *locals; // array of values
};

frame_t *make_frame(const definition_t *definition);
void frame_free(frame_t *self);
