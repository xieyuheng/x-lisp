#pragma once

struct placeholder_t {
    definition_t *definition;
    size_t code_index;
};

placeholder_t *make_placeholder(definition_t *definition, size_t code_index);
void placeholder_free(placeholder_t *self);
