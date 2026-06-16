#include "index.h"

int main(void) {
  test_start();

  {
    buffer_t *buffer = make_buffer();
    write_template(buffer, "abc");
    write_template(buffer, "def");
    assert(string_equal("abcdef", buffer_to_string(buffer)));
    buffer_free(buffer);
  }

  {
    buffer_t *buffer = make_buffer();
    write_template(buffer, "%s", "");
    write_template(buffer, "%s", "");
    assert(string_equal("", buffer_to_string(buffer)));
    buffer_free(buffer);
  }

  {
    buffer_t *buffer = make_buffer();
    write_template(buffer, " (%s) ", "abc");
    assert(string_equal(" (abc) ", buffer_to_string(buffer)));
    buffer_free(buffer);
  }

  {
    buffer_t *buffer = make_buffer();
    write_uint(buffer, 1);
    write_uint(buffer, 2);
    write_uint(buffer, 3);
    assert(string_equal("123", buffer_to_string(buffer)));
  }

  {
    buffer_t *buffer = make_buffer();
    write_int(buffer, -1);
    write_int(buffer, -2);
    write_int(buffer, -3);
    assert(string_equal("-1-2-3", buffer_to_string(buffer)));
  }

  {
    buffer_t *buffer = make_buffer();
    write_string(buffer, "abc");
    write_string(buffer, "def");
    assert(string_equal("abcdef", buffer_to_string(buffer)));
  }

  test_end();
}
