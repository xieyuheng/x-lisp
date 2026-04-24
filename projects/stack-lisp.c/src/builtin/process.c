#include "index.h"

value_t x_current_directory(void) {
  char *cwd = getcwd(NULL, 0);
  return x_object(make_xstring_take(cwd));
}

// value_t x_exit(void) {
//   exit(0);
//   return x_void;
// }
