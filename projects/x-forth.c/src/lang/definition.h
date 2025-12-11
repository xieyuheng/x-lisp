#pragma once

typedef enum {
    FUNCTION_DEFINITION,
    PRIMITIVE_DEFINITION,
    VARIABLE_DEFINITION,
    CONSTANT_DEFINITION,
} definition_kind_t;

struct definition_t {
    definition_kind_t kind;
    mod_t *mod;
    char *name;
    union {
        struct {
            array_t *parameters; // string array
            uint8_t *code_area;
            size_t code_area_size;
            size_t code_length;
        } function_definition;
        struct { primitive_t *primitive; } primitive_definition;
        struct { value_t value; } variable_definition;
        struct { value_t value; } constant_definition;
    };
};

definition_t *make_function_definition(mod_t *mod, char *name);
definition_t *make_primitive_definition(mod_t *mod, char *name, primitive_t *primitive);
definition_t *make_variable_definition(mod_t *mod, char *name, value_t value);
definition_t *make_constant_definition(mod_t *mod, char *name, value_t value);

void definition_free(definition_t *self);

void function_definition_append_instr(definition_t *self, struct instr_t instr);
