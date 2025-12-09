#pragma once

struct frame_t {
    const definition_t *definition;
    void *pc; // program counter
    array_t *locals; // array of values
};

frame_t *make_frame(const definition_t *definition);
void frame_free(frame_t *self);
