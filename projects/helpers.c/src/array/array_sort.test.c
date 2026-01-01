#include "index.h"

int
main(void) {
    test_start();

    {
        array_t *array = make_array();
        array_put(array, 0, (void *) 3);
        array_put(array, 1, (void *) 7);
        array_put(array, 2, (void *) 8);
        array_put(array, 3, (void *) 5);
        array_put(array, 4, (void *) 2);
        array_put(array, 5, (void *) 1);
        array_put(array, 6, (void *) 9);
        array_put(array, 7, (void *) 5);
        array_put(array, 8, (void *) 4);

        array_sort(array, int_compare_ascending);

        assert(array_get(array, 0) == (void *) 1);
        assert(array_get(array, 1) == (void *) 2);
        assert(array_get(array, 2) == (void *) 3);
        assert(array_get(array, 3) == (void *) 4);
        assert(array_get(array, 4) == (void *) 5);
        assert(array_get(array, 5) == (void *) 5);
        assert(array_get(array, 6) == (void *) 7);
        assert(array_get(array, 7) == (void *) 8);
        assert(array_get(array, 8) == (void *) 9);

        array_sort(array, int_compare_descending);

        assert(array_get(array, 0) == (void *) 9);
        assert(array_get(array, 1) == (void *) 8);
        assert(array_get(array, 2) == (void *) 7);
        assert(array_get(array, 3) == (void *) 5);
        assert(array_get(array, 4) == (void *) 5);
        assert(array_get(array, 5) == (void *) 4);
        assert(array_get(array, 6) == (void *) 3);
        assert(array_get(array, 7) == (void *) 2);
        assert(array_get(array, 8) == (void *) 1);

        array_free(array);
    }

    {
        array_t *array = make_array();
        array_put(array, 0, (void *) "A");
        array_put(array, 1, (void *) "BC");
        array_put(array, 2, (void *) "B");
        array_put(array, 3, (void *) "C");
        array_put(array, 4, (void *) "ABC");
        array_put(array, 5, (void *) "AB");
        array_put(array, 6, (void *) "CB");

        array_sort(array, string_compare_lexical);

        assert(string_equal(array_get(array, 0), "A"));
        assert(string_equal(array_get(array, 1), "AB"));
        assert(string_equal(array_get(array, 2), "ABC"));
        assert(string_equal(array_get(array, 3), "B"));
        assert(string_equal(array_get(array, 4), "BC"));
        assert(string_equal(array_get(array, 5), "C"));
        assert(string_equal(array_get(array, 6), "CB"));

        array_free(array);
    }

    test_end();
}
