#include "index.h"

static value_t read_mod_body(path_t *path) {
    file_t *file = open_file_or_fail(path_raw_string(path), "r");
    char *string = file_read_string(file);
    value_t sexps = parse_sexps(string);
    string_free(string);
    return sexps;
}

mod_t *stk_load(path_t *path) {
  value_t sexps = read_mod_body(path);
  mod_t *mod = make_mod(path);
  import_builtin(mod);
  // stk_declare(mod, sexps);
  stk_prepare(mod, sexps);
  stk_compile(mod, sexps);
  stk_setup(mod);
  return mod;
}
