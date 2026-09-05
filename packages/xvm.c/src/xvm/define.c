#include "index.h"

void define_variable(program_t *program, const char *name, value_t value) {
  program_define_variable(program, name, value);
}

void define_variable_primitive_0(program_t *program, const char *name, x_fn_0_t *fn_0) {
  program_define_variable(program, name, fn_0());
}

void define_primitive_0(program_t *program, const char *name, x_fn_0_t *fn_0) {
  program_define_primitive(program, name, (primitive_fn_t) fn_0, 0);
}

void define_primitive_1(program_t *program, const char *name, x_fn_1_t *fn_1) {
  program_define_primitive(program, name, (primitive_fn_t) fn_1, 1);
}

void define_primitive_2(program_t *program, const char *name, x_fn_2_t *fn_2) {
  program_define_primitive(program, name, (primitive_fn_t) fn_2, 2);
}

void define_primitive_3(program_t *program, const char *name, x_fn_3_t *fn_3) {
  program_define_primitive(program, name, (primitive_fn_t) fn_3, 3);
}

void define_primitive_4(program_t *program, const char *name, x_fn_4_t *fn_4) {
  program_define_primitive(program, name, (primitive_fn_t) fn_4, 4);
}

void define_primitive_5(program_t *program, const char *name, x_fn_5_t *fn_5) {
  program_define_primitive(program, name, (primitive_fn_t) fn_5, 5);
}

void define_primitive_6(program_t *program, const char *name, x_fn_6_t *fn_6) {
  program_define_primitive(program, name, (primitive_fn_t) fn_6, 6);
}
