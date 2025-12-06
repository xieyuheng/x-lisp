#pragma once

extern object_spec_t function_object_spec;

struct function_t {
    object_spec_t *spec;
    uint64_t address;
    function_metadata_t *metadata;
};

struct __attribute__((packed)) function_metadata_t {
    char *name;
    uint64_t arity;
    uint64_t is_primitive;
    variable_info_t *variable_info;
    uint64_t start;
    uint64_t end;
};

struct __attribute__((packed)) variable_info_t {
    uint64_t count;
    char **names;
};

function_t *make_function(uint64_t address, function_metadata_t *metadata);
void function_free(function_t *self);

bool function_equal(function_t *lhs, function_t *rhs);
void function_print(function_t *self);

bool function_p(value_t value);
function_t *to_function(value_t value);
value_t x_make_function(value_t address, value_t metadata);
