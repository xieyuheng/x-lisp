#include "index.h"

int main(void) {
  test_start();

  {
    buffer_t *buffer = make_buffer();
    uint_format(buffer, 1);
    uint_format(buffer, 2);
    uint_format(buffer, 3);
    assert(string_equal("123", buffer_to_string(buffer)));
  }

  {
    buffer_t *buffer = make_buffer();
    int_format(buffer, -1);
    int_format(buffer, -2);
    int_format(buffer, -3);
    assert(string_equal("-1-2-3", buffer_to_string(buffer)));
  }

  {
    buffer_t *buffer = make_buffer();
    string_format(buffer, "abc");
    string_format(buffer, "def");
    assert(string_equal("abcdef", buffer_to_string(buffer)));
  }

  test_end();
}
