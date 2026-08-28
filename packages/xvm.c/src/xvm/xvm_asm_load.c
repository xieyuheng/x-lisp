#include "index.h"
#include "../builtin/index.h"

program_t *xvm_asm_load_program(path_t *path, bool profile) {
  file_t *file = open_file_or_fail(path_raw_string(path), "r");
  char *string = file_read_string(file);

  double parsing_start = time_millisecond();
  value_t sexps = parse_sexps(string);
  string_free(string);
  double parsing_time = time_millisecond_passed(parsing_start);
  if (profile) {
    who_printf("parsing time: %.3fms\n", parsing_time);
  }

  double loading_start = time_millisecond();
  program_t *program = make_program();
  import_builtin(program);
  xvm_asm_declare(program, sexps);
  xvm_asm_prepare(program, sexps);
  xvm_asm_assemble(program, sexps);
  program_setup(program);
  double loading_time = time_millisecond_passed(loading_start);
  if (profile) {
    who_printf("loading time: %.3fms\n", loading_time);
  }

  return program;
}
