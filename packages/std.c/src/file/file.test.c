#include "index.h"

int main(void) {
  test_start();

  char *base = string_copy(__FILE__);
  int last_separator = -1;
  for (int i = 0; base[i] != '\0'; i++) {
    if (base[i] == '/' || base[i] == '\\') last_separator = i;
  }
  if (last_separator != -1) base[last_separator] = '\0';

  char *pathname = string_append(base, "/abc.txt");

  {
    file_t *file = open_file_or_fail(pathname, "rb");
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
