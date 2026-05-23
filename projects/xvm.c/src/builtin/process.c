#include "index.h"

value_t x_exit(value_t status) {
  exit(to_int64(status));
  return x_void;
}

value_t x_current_directory(void) {
  char *cwd = getcwd(NULL, 0);
  return x_object(make_xstring_take(cwd));
}
