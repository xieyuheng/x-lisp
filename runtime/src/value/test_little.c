#include "index.h"

void
test_little(void) {
    test_start();

    char *string = string_copy("_______");

    little_copy(x_true, string);
    assert(string_equal("#t", string));

    little_copy(x_false, string);
    assert(string_equal("#f", string));

    test_end();
}
