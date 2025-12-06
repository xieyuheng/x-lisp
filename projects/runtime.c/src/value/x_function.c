#include "index.h"

object_spec_t function_object_spec = {
    .name = "function",
    .print_fn = (object_print_fn_t *) function_print,
    .same_fn =  NULL,
    .equal_fn = (object_equal_fn_t *) function_equal,
};

function_t *
make_function(uint64_t address, function_metadata_t *metadata) {
    function_t *self = new(function_t);
    self->spec = &function_object_spec;
    self->address = address;
    self->metadata = metadata;
    return self;
}

void
function_free(function_t *self) {
    free(self);
}

bool
function_equal(function_t *lhs, function_t *rhs) {
    return lhs->address == rhs->address && lhs->metadata == rhs->metadata;
}

void
function_print(function_t *self) {
    printf("(@function ");
    // TODO
    (void) self;
    printf(")");
}

bool
function_p(value_t value) {
    if (!object_p(value)) return false;

    object_t *object = to_object(value);
    return object->spec == &function_object_spec;
}

function_t *
to_function(value_t value) {
    assert(function_p(value));

    object_t *object = to_object(value);
    return (function_t *) object;
}

value_t
x_make_function(value_t address, value_t metadata) {
    // where_printf("address: ");
    // value_print(address, stdout);
    // printf("\n");

    // where_printf("metadata: ");
    // value_print(metadata, stdout);
    // printf("\n");

    function_t *function = make_function(to_address(address), (void *) to_address(metadata));
    return x_object((object_t *) function);
}
