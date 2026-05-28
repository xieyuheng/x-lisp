#include "index.h"

int main(void) {
  test_start();

  {
    fs_iter_t *iter = fs_make_iter(".");
    char *name = fs_iter_next(iter);
    while (name) {
      where_printf("%s\n", name);
      string_free(name);
      name = fs_iter_next(iter);
    }

    fs_iter_free(iter);
  }

  test_end();
}
