#include "index.h"

int main(void) {
  test_start();

  {
    fs_recursive_iter_t *iter = fs_make_recursive_iter(".");
    char *name = fs_recursive_iter_next(iter);
    while (name) {
      printf("%s\n", name);
      string_free(name);
      name = fs_recursive_iter_next(iter);
    }
    fs_recursive_iter_free(iter);
  }

  test_end();
}
