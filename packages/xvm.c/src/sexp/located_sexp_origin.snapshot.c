#include "index.h"

int main(void) {
  init_global_gc();

  struct position_t origin = { .index = 10, .row = 2, .column = 3 };
  x_println(parse_located_sexps("*", origin, "a\nb"));
}
