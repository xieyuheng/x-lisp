#pragma once

definition_t *define_variable(program_t *program, const char *name, value_t value);
definition_t *define_variable_function(program_t *program, const char *name, function_t *function);
definition_t *define_variable_primitive_0(program_t *program, const char *name, x_fn_0_t *fn_0);

definition_t *define_function(program_t *program, const char *name, function_t *function);

definition_t *define_primitive_0(program_t *program, const char *name, x_fn_0_t *fn_0);
definition_t *define_primitive_1(program_t *program, const char *name, x_fn_1_t *fn_1);
definition_t *define_primitive_2(program_t *program, const char *name, x_fn_2_t *fn_2);
definition_t *define_primitive_3(program_t *program, const char *name, x_fn_3_t *fn_3);
definition_t *define_primitive_4(program_t *program, const char *name, x_fn_4_t *fn_4);
definition_t *define_primitive_5(program_t *program, const char *name, x_fn_5_t *fn_5);
definition_t *define_primitive_6(program_t *program, const char *name, x_fn_6_t *fn_6);
