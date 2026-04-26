#include "index.h"

int main(void) {
  test_start();

  {
    buffer_t *buffer = make_buffer();
    format_uint(buffer, 1);
    format_uint(buffer, 2);
    format_uint(buffer, 3);
    assert(string_equal("123", buffer_to_string(buffer)));
  }

  {
    buffer_t *buffer = make_buffer();
    format_int(buffer, -1);
    format_int(buffer, -2);
    format_int(buffer, -3);
    assert(string_equal("-1-2-3", buffer_to_string(buffer)));
  }

  {
    buffer_t *buffer = make_buffer();
    format_string(buffer, "abc");
    format_string(buffer, "def");
    assert(string_equal("abcdef", buffer_to_string(buffer)));
  }

  test_end();
}
