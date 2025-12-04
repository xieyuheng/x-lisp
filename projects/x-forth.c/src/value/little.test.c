#include "index.h"

int
main(void) {
    test_start();

    char *string = string_copy("_______");

    little_copy(x_true, string);
    assert(string_equal("#t", string));

    little_copy(x_false, string);
    assert(string_equal("#f", string));

    little_copy(x_void, string);
    assert(string_equal("#void", string));

    little_copy(x_null, string);
    assert(string_equal("#null", string));

    test_end();
}
