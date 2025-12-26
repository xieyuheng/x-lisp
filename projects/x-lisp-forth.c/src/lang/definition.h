#pragma once

typedef enum {
    FUNCTION_DEFINITION,
    PRIMITIVE_DEFINITION,
    VARIABLE_DEFINITION,
    PLACEHOLDER_DEFINITION,
} definition_kind_t;

extern const object_class_t definition_class;

struct definition_t {
    struct object_header_t header;
    definition_kind_t kind;
    mod_t *mod;
    char *name;
    union {
        struct { function_t *function; } function_definition;
        struct { primitive_t *primitive; } primitive_definition;
        struct { function_t *function; value_t value; } variable_definition;
        struct { array_t *placeholders; } placeholder_definition;
    };
};

definition_t *make_function_definition(mod_t *mod, char *name, function_t *function);
definition_t *make_primitive_definition(mod_t *mod, char *name, primitive_t *primitive);
definition_t *make_variable_definition(mod_t *mod, char *name, value_t value);
definition_t *make_placeholder_definition(mod_t *mod, char *name);

void definition_free(definition_t *self);

bool definition_p(value_t value);
definition_t *to_definition(value_t value);

bool definition_equal(definition_t *lhs, definition_t *rhs);
void definition_print(definition_t *self);

void placeholder_definition_hold_place(definition_t *self, function_t *function, size_t code_index);

bool definition_has_arity(const definition_t *self);
size_t definition_arity(const definition_t *self);
