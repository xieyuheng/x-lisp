#include "index.h"

static int saved_argc = 0;
static char **saved_argv = NULL;

void save_argv(int argc, char **argv) {
  saved_argc = argc;
  saved_argv = argv;
}

value_t x_current_directory(void) {
  char *cwd = getcwd(NULL, 0);
  return x_object(make_xstring_take(cwd));
}

value_t x_exit(value_t status) {
  exit(to_int64(status));
  return x_void;
}

value_t x_current_command_line_args(void) {
  value_t list = x_make_list();
  for (int i = 0; i < saved_argc; i++) {
    x_list_push_mut(x_object(make_xstring(saved_argv[i])), list);
  }

  return list;
}
