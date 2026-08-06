#include "index.h"

value_t x_open_input_file(value_t path) {
  char *pathname = string_copy(xtext_string(to_xtext(path)));
  xfile_t *xfile = open_input_xfile(pathname);
  return x_object(xfile);
}

value_t x_open_output_file(value_t path) {
  char *pathname = string_copy(xtext_string(to_xtext(path)));
  xfile_t *xfile = open_output_xfile(pathname);
  return x_object(xfile);
}

value_t x_file_close(value_t file) {
  xfile_close(to_xfile(file));
  return x_void;
}

value_t x_file_read(value_t file) {
  xtext_t *xtext = make_xtext_take(xfile_read(to_xfile(file)));
  return x_object(xtext);
}

value_t x_file_write(value_t file, value_t string) {
  xfile_write(to_xfile(file), xtext_string(to_xtext(string)));
  return x_void;
}

value_t x_file_writeln(value_t file, value_t string) {
  xfile_write(to_xfile(file), xtext_string(to_xtext(string)));
  xfile_write(to_xfile(file), "\n");
  return x_void;
}

value_t x_print(value_t x) {
  if (is_xtext(x)) {
    print_string(xtext_string(to_xtext(x)));
  } else {
    print_value(x);
  }

  return x_void;
}

value_t x_println(value_t x) {
  x_print(x);
  printf("\n");
  return x_void;
}
