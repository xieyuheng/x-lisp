#include "index.h"

int main(void) {
  test_start();

  {
    buffer_t *buffer = make_buffer();
    uint_format(buffer, 123);
    assert(string_equal("123", buffer_to_string(buffer)));
  }

  {
    buffer_t *buffer = make_buffer();
    int_format(buffer, -123);
    assert(string_equal("-123", buffer_to_string(buffer)));
  }

  test_end();
}
