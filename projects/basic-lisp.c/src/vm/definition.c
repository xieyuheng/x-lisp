#include "index.h"

const object_class_t definition_class = {
    .name = "definition",
    .equal_fn = (object_equal_fn_t *) definition_equal,
    .print_fn = (object_print_fn_t *) definition_print,
};

static definition_t *
make_definition(mod_t *mod, char *name) {
    definition_t *self = new(definition_t);
    self->header.class = &definition_class;
    self->mod = mod;
    self->name = name;
    return self;
}

definition_t *
make_function_definition(mod_t *mod, char *name, function_t *function) {
    definition_t *self = make_definition(mod, name);
    self->kind = FUNCTION_DEFINITION;
    self->function_definition.function = function;
    return self;
}

definition_t *
make_primitive_definition(mod_t *mod, char *name, primitive_t *primitive) {
    definition_t *self = make_definition(mod, name);
    self->kind = PRIMITIVE_DEFINITION;
    self->primitive_definition.primitive = primitive;
    return self;
}

definition_t *
make_variable_definition(mod_t *mod, char *name, value_t value) {
    definition_t *self = make_definition(mod, name);
    self->kind = VARIABLE_DEFINITION;
    self->variable_definition.value = value;
    return self;
}

void
definition_free(definition_t *self) {
    free(self->name);

    switch (self->kind) {
    case FUNCTION_DEFINITION: {
        function_free(self->function_definition.function);
        free(self);
        return;
    }

    case PRIMITIVE_DEFINITION: {
        primitive_free(self->primitive_definition.primitive);
        free(self);
        return;
    }

    case VARIABLE_DEFINITION: {
        if (self->variable_definition.function)
            function_free(self->variable_definition.function);
        free(self);
        return;
    }
    }
}

bool
definition_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &definition_class;
}

definition_t *
to_definition(value_t value) {
    assert(definition_p(value));
    return (definition_t *) to_object(value);
}

bool
definition_equal(definition_t *lhs, definition_t *rhs) {
    return lhs == rhs;
}

void
definition_print(printer_t *printer, definition_t *self) {
    (void) printer;
    printf("#<definition %s>", self->name);
}

bool
definition_has_arity(const definition_t *self) {
    switch (self->kind) {
    case FUNCTION_DEFINITION: {
        return self->function_definition.function->parameters;
    }

    case PRIMITIVE_DEFINITION: {
        return self->primitive_definition.primitive->fn_kind != X_FN;
    }

    case VARIABLE_DEFINITION: {
        return false;
    }
    }

    unreachable();
}

size_t
definition_arity(const definition_t *self) {
    switch (self->kind) {
    case FUNCTION_DEFINITION: {
        return array_length(self->function_definition.function->parameters);
    }

    case PRIMITIVE_DEFINITION: {
        switch (self->primitive_definition.primitive->fn_kind) {
        case X_FN: { unreachable(); }
        case X_FN_0: { return 0; }
        case X_FN_1: { return 1; }
        case X_FN_2: { return 2; }
        case X_FN_3: { return 3; }
        case X_FN_4: { return 4; }
        case X_FN_5: { return 5; }
        case X_FN_6: { return 6; }
        }

        unreachable();
    }

    case VARIABLE_DEFINITION: {
        unreachable();
    }
    }

    unreachable();
}
