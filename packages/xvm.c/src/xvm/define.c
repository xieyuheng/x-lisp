#include "index.h"

definition_t *define_variable(program_t *program, const char *name, value_t value) {
  definition_t *definition =
    make_variable_definition( string_copy(name), value);
  program_define(program, name, definition);
  return definition;
}

definition_t *define_variable_function(program_t *program, const char *name, function_t *function) {
  definition_t *definition =
    make_variable_definition( string_copy(name), x_void);
  definition->variable_definition.function = function;
  program_define(program, name, definition);
  return definition;
}

definition_t *define_variable_primitive_0(program_t *program, const char *name, x_fn_0_t *fn_0) {
  primitive_t *primitive = make_primitive_0(fn_0);
  definition_t *definition =
    make_variable_definition( string_copy(name), x_void);
  definition->variable_definition.primitive = primitive;
  program_define(program, name, definition);
  return definition;
}

definition_t *define_function(program_t *program, const char *name, function_t *function) {
  definition_t *definition =
    make_function_definition( string_copy(name), function);
  program_define(program, name, definition);
  return definition;
}

definition_t *define_primitive_0(program_t *program, const char *name, x_fn_0_t *fn_0) {
  primitive_t *primitive = make_primitive_0(fn_0);
  definition_t *definition =
    make_primitive_definition( string_copy(name), primitive);
  program_define(program, name, definition);
  return definition;
}

definition_t *define_primitive_1(program_t *program, const char *name, x_fn_1_t *fn_1) {
  primitive_t *primitive = make_primitive_1(fn_1);
  definition_t *definition =
    make_primitive_definition( string_copy(name), primitive);
  program_define(program, name, definition);
  return definition;
}

definition_t *define_primitive_2(program_t *program, const char *name, x_fn_2_t *fn_2) {
  primitive_t *primitive = make_primitive_2(fn_2);
  definition_t *definition =
    make_primitive_definition( string_copy(name), primitive);
  program_define(program, name, definition);
  return definition;
}

definition_t *define_primitive_3(program_t *program, const char *name, x_fn_3_t *fn_3) {
  primitive_t *primitive = make_primitive_3(fn_3);
  definition_t *definition =
    make_primitive_definition( string_copy(name), primitive);
  program_define(program, name, definition);
  return definition;
}

definition_t *define_primitive_4(program_t *program, const char *name, x_fn_4_t *fn_4) {
  primitive_t *primitive = make_primitive_4(fn_4);
  definition_t *definition =
    make_primitive_definition( string_copy(name), primitive);
  program_define(program, name, definition);
  return definition;
}

definition_t *define_primitive_5(program_t *program, const char *name, x_fn_5_t *fn_5) {
  primitive_t *primitive = make_primitive_5(fn_5);
  definition_t *definition =
    make_primitive_definition( string_copy(name), primitive);
  program_define(program, name, definition);
  return definition;
}

definition_t *define_primitive_6(program_t *program, const char *name, x_fn_6_t *fn_6) {
  primitive_t *primitive = make_primitive_6(fn_6);
  definition_t *definition =
    make_primitive_definition( string_copy(name), primitive);
  program_define(program, name, definition);
  return definition;
}
