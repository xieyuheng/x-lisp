#include "index.h"

mod_t *stk_load(path_t *path, bool profile) {
  file_t *file = open_file_or_fail(path_raw_string(path), "r");
  char *string = file_read_string(file);

  double parsing_start = time_millisecond();
  value_t sexps = parse_sexps(string);
  string_free(string);
  double parsing_time = time_millisecond_passed(parsing_start);
  if (profile) {
    who_printf("parsing time: %.3f ms\n", parsing_time);
  }

  double loading_start = time_millisecond();
  mod_t *mod = make_mod(path);
  import_builtin(mod);
  stk_declare(mod, sexps);
  stk_prepare(mod, sexps);
  stk_compile(mod, sexps);
  stk_setup(mod);
  double loading_time = time_millisecond_passed(loading_start);
  if (profile) {
    who_printf("loading time: %.3f ms\n", loading_time);
  }

  return mod;
}
