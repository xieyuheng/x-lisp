#pragma once

typedef enum {
    FUNCTION_DEFINITION,
    PRIMITIVE_DEFINITION,
    VARIABLE_DEFINITION,
    CONSTANT_DEFINITION,
    PLACEHOLDER_DEFINITION,
} definition_kind_t;

extern const char *definition_object_name;

struct definition_t {
    struct object_header_t header;
    definition_kind_t kind;
    mod_t *mod;
    char *name;
    union {
        struct {
            // - record of indexes.
            record_t *binding_indexes;
            // - optional string array.
            // - first list of bindings are viewed as parameters.
            array_t *parameters;
            uint8_t *code_area;
            size_t code_area_size;
            size_t code_length;
        } function_definition;
        struct { primitive_t *primitive; } primitive_definition;
        struct { value_t value; } variable_definition;
        struct { value_t value; } constant_definition;
        struct { array_t *placeholders; } placeholder_definition;
    };
};

definition_t *make_function_definition(mod_t *mod, char *name);
definition_t *make_primitive_definition(mod_t *mod, char *name, primitive_t *primitive);
definition_t *make_variable_definition(mod_t *mod, char *name, value_t value);
definition_t *make_constant_definition(mod_t *mod, char *name, value_t value);
definition_t *make_placeholder_definition(mod_t *mod, char *name);

void definition_free(definition_t *self);

bool definition_equal(definition_t *lhs, definition_t *rhs);
void definition_print(definition_t *self);

void function_definition_append_instr(definition_t *self, struct instr_t instr);
void function_definition_put_instr(definition_t *self, size_t code_index, struct instr_t instr);
void function_definition_put_definition(definition_t *self, size_t code_index, definition_t *definition);

void function_definition_add_binding(definition_t *self, const char *name);
bool function_definition_has_binding_index(definition_t *self, const char *name);
size_t function_definition_get_binding_index(definition_t *self, const char *name);

void placeholder_definition_hold_place(definition_t *self, definition_t *definition, size_t code_index);

bool definition_has_arity(const definition_t *self);
size_t definition_arity(const definition_t *self);
