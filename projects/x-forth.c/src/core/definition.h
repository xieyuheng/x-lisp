#pragma once

typedef enum {
    FUNCTION_DEFINITION,
    PRIMITIVE_FUNCTION_DEFINITION,
    VARIABLE_DEFINITION,
    CONSTANT_DEFINITION,
} definition_kind_t;

struct definition_t {
    definition_kind_t kind;
    mod_t *mod;
    char *name;
    union {
        struct { char *todo; } function_definition;
        struct { char *todo; } primitive_function_definition;
        struct { char *todo; } variable_definition;
        struct { char *todo; } constant_definition;
    };
};

definition_t *make_function_definition(mod_t *mod, char *name);
definition_t *make_primitive_function_definition(mod_t *mod, char *name);
definition_t *make_variable_definition(mod_t *mod, char *name);
definition_t *make_constant_definition(mod_t *mod, char *name);
