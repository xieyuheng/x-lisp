#pragma once

void define_variable(program_t *program, const char *name, value_t value);
void define_variable_primitive_0(program_t *program, const char *name, x_fn_0_t *fn_0);

void define_primitive_0(program_t *program, const char *name, x_fn_0_t *fn_0);
void define_primitive_1(program_t *program, const char *name, x_fn_1_t *fn_1);
void define_primitive_2(program_t *program, const char *name, x_fn_2_t *fn_2);
void define_primitive_3(program_t *program, const char *name, x_fn_3_t *fn_3);
void define_primitive_4(program_t *program, const char *name, x_fn_4_t *fn_4);
void define_primitive_5(program_t *program, const char *name, x_fn_5_t *fn_5);
void define_primitive_6(program_t *program, const char *name, x_fn_6_t *fn_6);
