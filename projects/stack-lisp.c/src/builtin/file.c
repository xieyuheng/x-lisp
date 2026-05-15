#include "index.h"

static value_t stdout_file_value;
static value_t stderr_file_value;
static bool standard_files_initialized_p = false;

static void ensure_standard_files(void) {
  if (!standard_files_initialized_p) {
    stdout_file_value = x_object(make_xfile(stdout));
    stderr_file_value = x_object(make_xfile(stderr));
    standard_files_initialized_p = true;
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

value_t x_open_input_file(value_t path) {
  char *pathname = string_copy(xstring_string(to_xstring(path)));
  xfile_t *xfile = open_input_xfile(pathname);
  return x_object(xfile);
}

value_t x_open_output_file(value_t path) {
  char *pathname = string_copy(xstring_string(to_xstring(path)));
  xfile_t *xfile = open_output_xfile(pathname);
  return x_object(xfile);
}

value_t x_file_close(value_t file) {
  xfile_close(to_xfile(file));
  return x_void;
}

value_t x_file_read(value_t file) {
  xstring_t *xstring = make_xstring_take(xfile_read(to_xfile(file)));
  return x_object(xstring);
}

value_t x_file_write(value_t file, value_t string) {
  xfile_write(to_xfile(file), xstring_string(to_xstring(string)));
  return x_void;
}

value_t x_file_writeln(value_t file, value_t string) {
  xfile_write(to_xfile(file), xstring_string(to_xstring(string)));
  xfile_write(to_xfile(file), "\n");
  return x_void;
}

value_t x_newline(void) {
  newline();
  return x_void;
}

value_t x_write(value_t x) {
  print_string(xstring_string(to_xstring(x)));
  return x_void;
}

value_t x_writeln(value_t x) {
  print_string(xstring_string(to_xstring(x)));
  newline();
  return x_void;
}

value_t x_print(value_t x) {
  print_value(x);
  return x_void;
}

value_t x_println(value_t x) {
  print_value(x);
  newline();
  return x_void;
}
