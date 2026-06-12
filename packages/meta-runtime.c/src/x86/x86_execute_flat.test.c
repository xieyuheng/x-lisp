#include "index.h"

int main(void) {
  test_start();

  {
    buffer_t *buffer = make_buffer();
    const uint8_t code[] = {
      0xB8, 0x2A, 0x00, 0x00, 0x00,    // mov eax, 42
      0xC3,                            // ret
    };
    buffer_append_bytes(buffer, code, sizeof(code));
    void *result = x86_execute_flat(buffer);
    assert(42 == (uint64_t) result);
    buffer_free(buffer);
  }

  test_end();
}
