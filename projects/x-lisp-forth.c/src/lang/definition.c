#include "index.h"

object_spec_t definition_object_spec = {
    .name = "definition",
    .print_fn = (object_print_fn_t *) NULL,
    .same_fn =  NULL,
    .equal_fn = (object_equal_fn_t *) NULL,
};

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

definition_t *
make_placeholder_definition(mod_t *mod, char *name) {
    definition_t *self = new(definition_t);
    self->kind = PLACEHOLDER_DEFINITION;
    self->mod = mod;
    self->name = name;
    self->placeholder_definition.placeholders =
        make_array_auto_with((free_fn_t *) placeholder_free);
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
        free(self);
        return;
    }

    case PRIMITIVE_DEFINITION: {
        primitive_free(self->primitive_definition.primitive);
        free(self);
        return;
    }

    case VARIABLE_DEFINITION: {
        free(self);
        return;
    }

    case CONSTANT_DEFINITION: {
        free(self);
        return;
    }

    case PLACEHOLDER_DEFINITION: {
        array_free(self->placeholder_definition.placeholders);
        free(self);
        return;
    }
    }
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

void function_definition_put_instr(
    definition_t *self,
    size_t code_index,
    struct instr_t instr
) {
    assert(self->kind == FUNCTION_DEFINITION);
    size_t length = instr_length(instr);
    assert(code_index + length < self->function_definition.code_area_size);

    uint8_t *code = self->function_definition.code_area + code_index;
    instr_encode(code, instr);
}

void
function_definition_put_definition(
    definition_t *self,
    size_t code_index,
    definition_t *definition
) {
    assert(self->kind == FUNCTION_DEFINITION);
    assert(code_index + sizeof(definition_t) <
           self->function_definition.code_area_size);

    uint8_t *code = self->function_definition.code_area + code_index;
    memory_store_little_endian(code, definition);
}

void
function_definition_add_binding(definition_t *self, const char *name) {
    assert(self->kind == FUNCTION_DEFINITION);

    if (!function_definition_has_binding_index(self, name)) {
        size_t next_index =
            record_length(self->function_definition.binding_indexes);
        record_insert(self->function_definition.binding_indexes,
                      name, (void *) next_index);
    }
}

bool
function_definition_has_binding_index(definition_t *self, const char *name) {
    assert(self->kind == FUNCTION_DEFINITION);

    return record_has(self->function_definition.binding_indexes, name);
}

size_t
function_definition_get_binding_index(definition_t *self, const char *name) {
    assert(self->kind == FUNCTION_DEFINITION);

    assert(function_definition_has_binding_index(self, name));
    return (size_t) record_get(self->function_definition.binding_indexes, name);
}

void
placeholder_definition_hold_place(
    definition_t *self,
    definition_t *definition,
    size_t code_index
) {
    assert(self->kind == PLACEHOLDER_DEFINITION);
    array_push(
        self->placeholder_definition.placeholders,
        make_placeholder(definition, code_index));
}
