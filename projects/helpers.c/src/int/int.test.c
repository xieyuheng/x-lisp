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

  {
    assert(0 == uint_align_to_power_of_two(0));
    assert(1 == uint_align_to_power_of_two(1));
    assert(2 == uint_align_to_power_of_two(2));
    assert(4 == uint_align_to_power_of_two(3));
    assert(4 == uint_align_to_power_of_two(4));
    assert(8 == uint_align_to_power_of_two(5));
    assert(8 == uint_align_to_power_of_two(6));
    assert(8 == uint_align_to_power_of_two(7));
    assert(8 == uint_align_to_power_of_two(8));
    assert(16 == uint_align_to_power_of_two(16));
    assert(32 == uint_align_to_power_of_two(24));
  }

  test_end();
}
