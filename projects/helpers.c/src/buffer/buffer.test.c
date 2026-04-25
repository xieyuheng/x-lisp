#include "index.h"

int main(void) {
  test_start();

  {
    buffer_t *buffer = make_zero_buffer(3);
    assert(buffer_length(buffer) == 3);
    assert(0 == buffer_get_byte(buffer, 0));
    assert(0 == buffer_get_byte(buffer, 1));
    assert(0 == buffer_get_byte(buffer, 2));
    buffer_free(buffer);
  }

  {
    buffer_t *buffer = make_buffer();
    buffer_put_byte(buffer, 0, 'a');
    buffer_put_byte(buffer, 1, 'b');
    buffer_put_byte(buffer, 2, 'c');
    assert(buffer_length(buffer) == 3);
    assert('a' == buffer_get_byte(buffer, 0));
    assert('b' == buffer_get_byte(buffer, 1));
    assert('c' == buffer_get_byte(buffer, 2));
    buffer_free(buffer);
  }

  {
    buffer_t *buffer_1 = make_buffer();
    buffer_put_byte(buffer_1, 0, 'a');
    buffer_put_byte(buffer_1, 1, 'b');
    buffer_put_byte(buffer_1, 2, 'c');
    buffer_t *buffer_2 = buffer_copy(buffer_1);
    buffer_put_byte(buffer_1, 0, 'a');
    buffer_put_byte(buffer_1, 1, 'b');
    buffer_put_byte(buffer_1, 2, 'c');
    assert(buffer_equal(buffer_1, buffer_2));
    buffer_free(buffer_1);
    buffer_free(buffer_2);
  }

  {
    buffer_t *buffer_1 = make_buffer();
    buffer_put_byte(buffer_1, 0, 'a');
    buffer_put_byte(buffer_1, 1, 'b');
    buffer_put_byte(buffer_1, 2, 'c');
    buffer_t *buffer_2 = buffer_copy(buffer_1);
    assert('a' == buffer_get_byte(buffer_2, 0));
    assert('b' == buffer_get_byte(buffer_2, 1));
    assert('c' == buffer_get_byte(buffer_2, 2));
    assert(buffer_equal(buffer_1, buffer_2));
    buffer_free(buffer_1);
    buffer_free(buffer_2);
  }

  {
    buffer_t *buffer = make_buffer();
    assert(string_equal("", buffer_to_string(buffer)));
    buffer_append_char(buffer, 'a');
    assert(string_equal("a", buffer_to_string(buffer)));
    buffer_append_char(buffer, 'b');
    assert(string_equal("ab", buffer_to_string(buffer)));
    buffer_append_char(buffer, 'c');
    assert(string_equal("abc", buffer_to_string(buffer)));
    buffer_free(buffer);
  }

  {
    buffer_t *buffer = make_buffer();
    buffer_printf(buffer, " (%s) ", "abc");
    who_printf("buffer_capacity(buffer): %ld\n", buffer_capacity(buffer));
    who_printf("buffer_length(buffer): %ld\n", buffer_length(buffer));
    who_printf("|%s|\n", buffer_raw_bytes(buffer));
    assert(string_equal(" (abc) ", buffer_to_string(buffer)));
    buffer_free(buffer);
  }

  test_end();
}
