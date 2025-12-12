#include "index.h"

definition_t *
make_function_definition(mod_t *mod, char *name) {
    definition_t *self = new(definition_t);
    self->kind = FUNCTION_DEFINITION;
    self->mod = mod;
    self->name = name;
    self->function_definition.binding_indexes = make_record();
    self->function_definition.parameters = NULL;
    self->function_definition.code_area_size = 64;
    self->function_definition.code_area =
        allocate(self->function_definition.code_area_size);
    self->function_definition.code_length = 0;
    return self;
}

definition_t *
make_primitive_definition(mod_t *mod, char *name, primitive_t *primitive) {
    definition_t *self = new(definition_t);
    self->kind = PRIMITIVE_DEFINITION;
    self->mod = mod;
    self->name = name;
    self->primitive_definition.primitive = primitive;
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
    case FUNCTION_DEFINITION: {
        record_free(self->function_definition.binding_indexes);
        if (self->function_definition.parameters)
            array_free(self->function_definition.parameters);
        free(self->function_definition.code_area);
        break;
    }

    case PRIMITIVE_DEFINITION: {
        primitive_free(self->primitive_definition.primitive);
        break;
    }

    case VARIABLE_DEFINITION: {
        break;
    }

    case CONSTANT_DEFINITION: {
        break;
    }
    }

    free(self);
}

static void
function_definition_maybe_grow_code_area(definition_t *self, size_t length) {
    assert(self->kind == FUNCTION_DEFINITION);

    if (self->function_definition.code_area_size <
        self->function_definition.code_length + length)
    {
        self->function_definition.code_area =
            reallocate(self->function_definition.code_area,
                       self->function_definition.code_area_size,
                       self->function_definition.code_area_size * 2);
        self->function_definition.code_area_size *= 2;
        function_definition_maybe_grow_code_area(self, length);
    }
}

void
function_definition_append_instr(definition_t *self, struct instr_t instr) {
    assert(self->kind == FUNCTION_DEFINITION);

    size_t length = instr_length(instr);
    function_definition_maybe_grow_code_area(self, length);

    uint8_t *code =
        self->function_definition.code_area +
        self->function_definition.code_length;
    instr_encode(code, instr);

    self->function_definition.code_length += length;
}

void
function_definition_add_binding(definition_t *self, const char *name) {
    assert(self->kind == FUNCTION_DEFINITION);

    if (!record_has(self->function_definition.binding_indexes, name)) {
        size_t next_index =
            record_length(self->function_definition.binding_indexes);
        record_insert(self->function_definition.binding_indexes,
                      name, (void *) next_index);
    }
}
