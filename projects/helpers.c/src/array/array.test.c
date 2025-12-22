#include "index.h"

int
main(void) {
    test_start();

    array_t *array = make_array_with(
        100, (free_fn_t *) string_free);

    assert(array);
    assert(array_length(array) == 0);
    assert(array_is_empty(array));

    char *cheese = string_copy("boursin");
    char *bread = string_copy("baguette");
    char *wine = string_copy("bordeaux");

    array_push(array, cheese);
    assert(array_length(array) == 1);
    assert(!array_is_empty(array));

    array_push(array, bread);
    assert(array_length(array) == 2);
    assert(!array_is_empty(array));

    array_push(array, wine);
    assert(array_length(array) == 3);
    assert(!array_is_empty(array));

    assert(array_pick(array, 0) == wine);
    assert(array_pick(array, 1) == bread);
    assert(array_pick(array, 2) == cheese);

    assert(array_get(array, 2) == wine);
    assert(array_get(array, 1) == bread);
    assert(array_get(array, 0) == cheese);

    assert(array_pop(array) == wine);
    assert(array_pop(array) == bread);
    assert(array_pop(array) == cheese);

    assert(array_length(array) == 0);
    assert(array_is_empty(array));

    array_push(array, cheese);
    array_push(array, bread);
    array_push(array, wine);
    assert(array_length(array) == 3);

    array_purge(array);
    assert(array_length(array) == 0);
    assert(array_is_empty(array));

    array_free(array);

    {
        // cast atom value to void *.

        array_t *array = make_array(3);

        array_push(array, (void *) 1);
        array_push(array, (void *) 0);
        array_push(array, (void *) -1);

        assert(((int64_t) array_pop(array)) == -1);
        assert(((int64_t) array_pop(array)) == 0);
        assert(((int64_t) array_pop(array)) == 1);

        array_free(array);
    }

    {
        // array_push + auto grow

        array_t *array = make_array(3);

        array_push(array, (void *) 1);
        array_push(array, (void *) 2);
        array_push(array, (void *) 3);

        array_push(array, (void *) 4);

        array_push(array, (void *) 5);
        array_push(array, (void *) 6);

        array_free(array);
    }

    {
        // array_put + auto grow

        array_t *array = make_array(3);

        array_put(array, 4, (void *) 1);
        assert(array_length(array) == 5);

        assert(array_get(array, 0) == NULL);
        assert(array_get(array, 1) == NULL);
        assert(array_get(array, 2) == NULL);
        assert(array_get(array, 3) == NULL);
        assert(array_get(array, 4) == (void *) 1);
        assert(array_get(array, 5) == NULL);

        array_free(array);
    }

    {
        // array_put + auto grow -- again

        array_t *array = make_array_auto();

        array_put(array, 0, (void *) 1);
        assert(array_length(array) == 1);

        assert(array_get(array, 0) == (void *) 1);
        assert(array_get(array, 1) == NULL);

        array_free(array);
    }

    test_end();
}
