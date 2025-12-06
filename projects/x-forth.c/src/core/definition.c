#include "index.h"

definition_t *
make_function_definition(mod_t *mod, char *name) {
    definition_t *self = new(definition_t);
    self->kind = FUNCTION_DEFINITION;
    self->mod = mod;
    self->name = name;
    self->function_definition.parameters = make_string_array_auto();
    self->function_definition.program = allocate(0);
    self->function_definition.program_size = 0;
    return self;
}

definition_t *
make_primitive_function_definition(mod_t *mod, char *name) {
    definition_t *self = new(definition_t);
    self->kind = PRIMITIVE_FUNCTION_DEFINITION;
    self->mod = mod;
    self->name = name;
    return self;
}

definition_t *
make_variable_definition(mod_t *mod, char *name, value_t value) {
    definition_t *self = new(definition_t);
    self->kind = VARIABLE_DEFINITION;
    self->mod = mod;
    self->name = name;
    self->variable_definition.value = value;
    return self;
}

definition_t *
make_constant_definition(mod_t *mod, char *name, value_t value) {
    definition_t *self = new(definition_t);
    self->kind = CONSTANT_DEFINITION;
    self->mod = mod;
    self->name = name;
    self->constant_definition.value = value;
    return self;
}

void
definition_free(definition_t *self) {
    free(self->name);

    switch (self->kind) {
    case FUNCTION_DEFINITION:
        array_free(self->function_definition.parameters);
        free(self->function_definition.program);
        break;
    case PRIMITIVE_FUNCTION_DEFINITION:
        break;
    case VARIABLE_DEFINITION:
        break;
    case CONSTANT_DEFINITION:
        break;
    }

    free(self);
}
