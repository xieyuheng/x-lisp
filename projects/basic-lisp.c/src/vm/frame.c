#include "index.h"

frame_t *
make_function_frame(const function_t *function) {
    frame_t *self = new(frame_t);
    self->kind = FUNCTION_FRAME;
    self->code = function->code_area;
    self->pc = self->code;
    self->locals = make_array();
    self->function_frame.function = function;
    return self;
}

frame_t *
make_code_frame(uint8_t *code) {
    frame_t *self = new(frame_t);
    self->kind = CODE_FRAME;
    self->code = code;
    self->pc = self->code;
    self->locals = make_array();
    return self;
}

frame_t *make_break_frame() {
    frame_t *self = new(frame_t);
    self->kind = BREAK_FRAME;
    return self;
}

void
frame_free(frame_t *self) {
    switch (self->kind) {
    case FUNCTION_FRAME: {
        array_free(self->locals);
        free(self);
        return;
    }

    case CODE_FRAME: {
        free(self->code);
        array_free(self->locals);
        free(self);
        return;
    }

    case BREAK_FRAME: {
        free(self);
        return;
    }
    }
}

inline value_t
frame_get_local(frame_t *self, size_t index) {
    return (value_t) array_get(self->locals, index);
}

inline void
frame_put_local(frame_t *self, size_t index, value_t value) {
    array_put(self->locals, index, (void *) value);
}
