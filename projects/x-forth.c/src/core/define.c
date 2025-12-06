#include "index.h"

definition_t *
define_constant(mod_t *mod, const char *name, value_t *value) {
    definition_t *definition =
        make_constant_definition(mod, string_copy(name), value);
    mod_define(mod, name, definition);
    return definition;
}

definition_t *
define_variable(mod_t *mod, const char *name, value_t *value) {
    definition_t *definition =
        make_variable_definition(mod, string_copy(name), value);
    mod_define(mod, name, definition);
    return definition;
}
