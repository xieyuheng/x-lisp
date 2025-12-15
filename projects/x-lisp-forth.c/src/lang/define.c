#include "index.h"

definition_t *
define_placeholder(mod_t *mod, const char *name) {
    definition_t *definition =
        make_placeholder_definition(mod, string_copy(name));
    mod_define(mod, name, definition);
    return definition;
}

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

definition_t *
define_function(mod_t *mod, const char *name) {
    definition_t *definition =
        make_function_definition(mod, string_copy(name));
    mod_define(mod, name, definition);
    return definition;
}

definition_t *
define_primitive(mod_t *mod, const char *name, x_fn_t *fn) {
    primitive_t *primitive = make_primitive(fn);
    definition_t *definition =
        make_primitive_definition(mod, string_copy(name), primitive);
    mod_define(mod, name, definition);
    return definition;
}

definition_t *
define_primitive_0(mod_t *mod, const char *name, x_fn_0_t *fn_0) {
    primitive_t *primitive = make_primitive_0(fn_0);
    definition_t *definition =
        make_primitive_definition(mod, string_copy(name), primitive);
    mod_define(mod, name, definition);
    return definition;
}

definition_t *
define_primitive_1(mod_t *mod, const char *name, x_fn_1_t *fn_1) {
    primitive_t *primitive = make_primitive_1(fn_1);
    definition_t *definition =
        make_primitive_definition(mod, string_copy(name), primitive);
    mod_define(mod, name, definition);
    return definition;
}

definition_t *
define_primitive_2(mod_t *mod, const char *name, x_fn_2_t *fn_2) {
    primitive_t *primitive = make_primitive_2(fn_2);
    definition_t *definition =
        make_primitive_definition(mod, string_copy(name), primitive);
    mod_define(mod, name, definition);
    return definition;
}

definition_t *
define_primitive_3(mod_t *mod, const char *name, x_fn_3_t *fn_3) {
    primitive_t *primitive = make_primitive_3(fn_3);
    definition_t *definition =
        make_primitive_definition(mod, string_copy(name), primitive);
    mod_define(mod, name, definition);
    return definition;
}

definition_t *
define_primitive_4(mod_t *mod, const char *name, x_fn_4_t *fn_4) {
    primitive_t *primitive = make_primitive_4(fn_4);
    definition_t *definition =
        make_primitive_definition(mod, string_copy(name), primitive);
    mod_define(mod, name, definition);
    return definition;
}

definition_t *
define_primitive_5(mod_t *mod, const char *name, x_fn_5_t *fn_5) {
    primitive_t *primitive = make_primitive_5(fn_5);
    definition_t *definition =
        make_primitive_definition(mod, string_copy(name), primitive);
    mod_define(mod, name, definition);
    return definition;
}

definition_t *
define_primitive_6(mod_t *mod, const char *name, x_fn_6_t *fn_6) {
    primitive_t *primitive = make_primitive_6(fn_6);
    definition_t *definition =
        make_primitive_definition(mod, string_copy(name), primitive);
    mod_define(mod, name, definition);
    return definition;
}
