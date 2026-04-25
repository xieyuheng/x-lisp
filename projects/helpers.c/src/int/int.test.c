#include "index.h"

int main(void) {
  test_start();

  assert(uint_max(1, 2) == 2);
  assert(uint_min(1, 2) == 1);

  assert(string_equal(uint_to_string(123), "123"));
  assert(string_equal(uint_to_subscript(123), "₁₂₃"));
  assert(string_equal(uint_to_superscript(123), "¹²³"));

  assert(uint_decimal_length(1) == 1);
  assert(uint_decimal_length(12) == 2);
  assert(uint_decimal_length(123) == 3);
  assert(uint_decimal_length(1234) == 4);

  {
    assert(int_relu(1) == 1);
    assert(int_relu(-1) == 0);

    int x = -1;
    assert(int_relu(x) == 0);
  }

  {
    assert(0 == uint_align(16, 0));
    assert(16 == uint_align(16, 8));
    assert(16 == uint_align(16, 16));
    assert(32 == uint_align(16, 24));
  }

  test_end();
}
