#include "index.h"

value_t x_error(value_t message) {
  print(message);
  exit(1);
}

value_t x_error_with_source_location(value_t value, value_t source_location) {
  print(value);
  print(source_location);
  exit(1);
}
