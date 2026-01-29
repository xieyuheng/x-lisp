#pragma once

struct placeholder_t {
    function_t *function;
    size_t code_index;
};

placeholder_t *make_placeholder(function_t *function, size_t code_index);
void placeholder_free(placeholder_t *self);
