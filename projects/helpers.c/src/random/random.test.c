#include "index.h"

int main(void) {
  test_start();

  for (size_t i = 0; i < 10; i++) {
    who_printf("random_int(0, 10): %ld\n", random_int(0, 10));
  }

  for (size_t i = 0; i < 10; i++) {
    who_printf("random_float(0, 10): %f\n", random_float(0, 10));
  }

  test_end();
}
