#pragma once

struct place_t {
    definition_t *definition;
    size_t code_index;
};

typedef struct place_t place_t;

struct placeholder_t {
    array_t *places;
};
