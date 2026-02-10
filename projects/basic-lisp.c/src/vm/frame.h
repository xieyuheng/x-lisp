#pragma once

typedef enum {
    FUNCTION_FRAME,
    CODE_FRAME,
} frame_kind_t;

// - FUNCTION_FRAME -- the function owns the code.
// - CODE_FRAME -- the frame owns the code.

struct frame_t {
    frame_kind_t kind;
    uint8_t *code;
    uint8_t *pc;
    array_t *locals; // array of values
    union {
        struct { const function_t *function; } function_frame;
    };
};

frame_t *make_function_frame(const function_t *function);
frame_t *make_code_frame(uint8_t *code);
void frame_free(frame_t *self);

value_t frame_get_local(frame_t *self, size_t index);
void frame_put_local(frame_t *self, size_t index, value_t value);
