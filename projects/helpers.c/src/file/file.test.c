#include "index.h"

int main(void) {
  test_start();

  char *base = dirname(string_copy(__FILE__));
  char *pathname = string_append(base, "/abc.txt");


  {
    file_t *file = open_file_or_fail(pathname, "r");
    char *string = file_read_string(file);
    assert(
      string_equal(
        string,
        "abc\n"
        "abc\n"
        "abc\n"));
  }

  test_end();
}
