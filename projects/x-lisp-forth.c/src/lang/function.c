#include "index.h"

function_t *
make_function(void) {
    function_t *self = new(function_t);
    self->binding_indexes = make_record();
    self->parameters = NULL;
    self->code_area_size = 64;
    self->code_area = allocate(self->code_area_size);
    self->code_length = 0;
    return self;
}

void
function_free(function_t *self) {
    record_free(self->binding_indexes);
    if (self->parameters)
        array_free(self->parameters);
    free(self->code_area);
    free(self);
}
