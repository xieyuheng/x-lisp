#include "index.h"

value_t x_error(value_t info) {
  print_value(info);
  exit(1);
}

value_t x_error_with_location(value_t info, value_t location) {
  x_println(info);
  x_println(location);
  exit(1);
}
