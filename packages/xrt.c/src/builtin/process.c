#include "index.h"

static array_t *command_line = NULL;
static array_t *full_command_line = NULL;

void setup_full_command_line(size_t argc, char **argv) {
  if (full_command_line) {
    array_free(full_command_line);
  }
  full_command_line = make_string_array();
  for (size_t i = 0; i < argc; i++) {
    array_push(full_command_line, string_copy(argv[i]));
  }
}

void setup_current_command_line(array_t *passthrough) {
  if (command_line) {
    array_free(command_line);
  }
  command_line = make_string_array();
  size_t length = array_length(passthrough);
  for (size_t i = 0; i < length; i++) {
    array_push(command_line, string_copy((char *) array_get(passthrough, i)));
  }
}

value_t x_current_command_line(void) {
  if (!command_line) {
    return x_make_list();
  }
  value_t list = x_make_list();
  size_t length = array_length(command_line);
  for (size_t i = 0; i < length; i++) {
    char *str = (char *) array_get(command_line, i);
    x_list_push_mut(x_object(make_xstring(str)), list);
  }
  return list;
}

value_t x_current_full_command_line(void) {
  if (!full_command_line) {
    return x_make_list();
  }
  value_t list = x_make_list();
  size_t length = array_length(full_command_line);
  for (size_t i = 0; i < length; i++) {
    char *str = (char *) array_get(full_command_line, i);
    x_list_push_mut(x_object(make_xstring(str)), list);
  }
  return list;
}

value_t x_exit(value_t status) {
  exit(to_int64(status));
  return x_void;
}

value_t x_current_directory(void) {
  char *cwd = getcwd(NULL, 0);
  return x_object(make_xstring_take(cwd));
}

static value_t stdout_file_value;
static value_t stderr_file_value;
static bool standard_files_initialized = false;

static void ensure_standard_files(void) {
  if (!standard_files_initialized) {
    stdout_file_value = x_object(make_static_xfile(stdout));
    stderr_file_value = x_object(make_static_xfile(stderr));
    standard_files_initialized = true;
  }
}

value_t x_current_stdout_file(void) {
  ensure_standard_files();
  return stdout_file_value;
}

value_t x_current_stderr_file(void) {
  ensure_standard_files();
  return stderr_file_value;
}
