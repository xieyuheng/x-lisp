#include "index.h"

int
main(void) {
    test_start();

    set_t *set = make_set();

    array_t *values = make_string_array();
    array_push(values, string_copy("dead beef"));
    array_push(values, string_copy("a bad cafe"));
    array_push(values, string_copy("coded bad"));
    array_push(values, string_copy("dead food"));

    assert(set_add(set, array_get(values, 0)));
    assert(set_add(set, array_get(values, 1)));
    assert(set_add(set, array_get(values, 2)));
    assert(set_add(set, array_get(values, 3)));

    {
        array_t *values_again = set_values(set);
        assert(string_equal(array_get(values, 0), array_get(values_again, 0)));
        assert(string_equal(array_get(values, 1), array_get(values_again, 1)));
        assert(string_equal(array_get(values, 2), array_get(values_again, 2)));
        assert(string_equal(array_get(values, 3), array_get(values_again, 3)));
        array_free(values_again);
    }

    {
        size_t i = 0;
        set_iter_t iter;
        set_iter_init(&iter, set);
        char *value = set_iter_next(&iter);
        while (value) {
            assert(string_equal(value, array_get(values, i)));
            value = set_iter_next(&iter);
            i++;
        }
    }

    array_free(values);
    set_free(set);

    test_end();
}
