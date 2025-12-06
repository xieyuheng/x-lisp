#pragma once

struct frame_t {
    definition_t *definition;
    void *pc;
    array_t *locals;
};
