#pragma once

struct function_t {
    // - record of indexes.
    record_t *binding_indexes;
    // - optional string array.
    // - first list of bindings are viewed as parameters.
    array_t *parameters;
    uint8_t *code_area;
    size_t code_area_size;
    size_t code_length;
};

function_t *make_function(void);
void function_free(function_t *self);
