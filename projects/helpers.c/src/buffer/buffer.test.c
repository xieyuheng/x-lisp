#include "index.h"

int main(void) {
  test_start();

  {
    buffer_t *buffer = make_buffer(3);
    buffer_bytes(buffer)[0] = 'a';
    buffer_bytes(buffer)[1] = 'b';
    buffer_bytes(buffer)[2] = 'c';

    assert(buffer_size(buffer) == 3);
    assert(string_equal(buffer_string(buffer), "abc"));

    buffer_free(buffer);
  }

  {
    buffer_t *buffer_1 = make_buffer(3);
    buffer_bytes(buffer_1)[0] = 'a';
    buffer_bytes(buffer_1)[1] = 'b';
    buffer_bytes(buffer_1)[2] = 'c';

    buffer_t *buffer_2 = make_buffer(3);
    buffer_bytes(buffer_2)[0] = 'a';
    buffer_bytes(buffer_2)[1] = 'b';
    buffer_bytes(buffer_2)[2] = 'c';

    assert(buffer_1 != buffer_2);
    assert(buffer_equal(buffer_1, buffer_2));

    buffer_bytes(buffer_2)[1] = 'B';

    assert(!buffer_equal(buffer_1, buffer_2));

    buffer_free(buffer_1);
    buffer_free(buffer_2);
  }

  {
    buffer_t *buffer_1 = make_buffer(3);
    buffer_bytes(buffer_1)[0] = 'a';
    buffer_bytes(buffer_1)[1] = 'b';
    buffer_bytes(buffer_1)[2] = 'c';

    buffer_t *buffer_2 = buffer_copy(buffer_1);

    assert(buffer_1 != buffer_2);
    assert(buffer_equal(buffer_1, buffer_2));

    buffer_bytes(buffer_2)[1] = 'B';

    assert(!buffer_equal(buffer_1, buffer_2));

    buffer_free(buffer_1);
    buffer_free(buffer_2);
  }

  test_end();
}
