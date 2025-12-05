#include "index.h"

definition_t *
make_function_definition(mod_t *mod, char *name) {
    definition_t *self = new(definition_t);
    self->kind = FUNCTION_DEFINITION;
    return self;
}

definition_t *
make_primitive_function_definition(mod_t *mod, char *name) {
    definition_t *self = new(definition_t);
    self->kind = PRIMITIVE_FUNCTION_DEFINITION;
    return self;
}

definition_t *
make_variable_definition(mod_t *mod, char *name) {
    definition_t *self = new(definition_t);
    self->kind = VARIABLE_DEFINITION;
    return self;
}

definition_t *
make_constant_definition(mod_t *mod, char *name) {
    definition_t *self = new(definition_t);
    self->kind = CONSTANT_DEFINITION;
    return self;
}
