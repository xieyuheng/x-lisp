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

static value_t print_impl(value_t x, lang_t lang) {
  if (is_xtext(x)) {
    print_string(xtext_string(to_xtext(x)));
  } else {
    print_value(x, lang);
  }

  return x_void;
}

value_t x_print(value_t x) {
  return print_impl(x, LANG_EN);
}

value_t x_print_zh(value_t x) {
  return print_impl(x, LANG_ZH);
}

value_t x_println(value_t x) {
  print_impl(x, LANG_EN);
  printf("\n");
  return x_void;
}

value_t x_println_zh(value_t x) {
  print_impl(x, LANG_ZH);
  printf("\n");
  return x_void;
}
