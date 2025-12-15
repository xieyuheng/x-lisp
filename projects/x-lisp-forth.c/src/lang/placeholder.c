#include "index.h"

struct place_t {
    definition_t *definition;
    size_t code_index;
};

typedef struct place_t place_t;

static place_t *
make_place(definition_t *definition, size_t code_index) {
    place_t *self = new(place_t);
    self->definition = definition;
    self->code_index = code_index;
    return self;
}

struct placeholder_t {
    array_t *places;
};

placeholder_t *
make_placeholder(void) {
    (void) make_place;
    placeholder_t *self = new(placeholder_t);
    // self->places = make_array_auto_with();
    self->places = make_array_auto();
    return self;
}
