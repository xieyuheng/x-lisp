#include "index.h"

int
main(void) {
    test_start();

    {
        array_t *array = make_array_with((free_fn_t *) string_free);

        assert(array);
        assert(array_length(array) == 0);
        assert(array_is_empty(array));

        char *A = string_copy("A");
        char *B = string_copy("B");
        char *C = string_copy("C");

        array_push(array, A);
        assert(array_length(array) == 1);
        assert(!array_is_empty(array));

        array_push(array, B);
        assert(array_length(array) == 2);
        assert(!array_is_empty(array));

        array_push(array, C);
        assert(array_length(array) == 3);
        assert(!array_is_empty(array));

        assert(array_pick(array, 0) == C);
        assert(array_pick(array, 1) == B);
        assert(array_pick(array, 2) == A);

        assert(array_get(array, 2) == C);
        assert(array_get(array, 1) == B);
        assert(array_get(array, 0) == A);

        assert(array_pop(array) == C);
        assert(array_pop(array) == B);
        assert(array_pop(array) == A);

        assert(array_length(array) == 0);
        assert(array_is_empty(array));

        array_push(array, A);
        array_push(array, B);
        array_push(array, C);
        assert(array_length(array) == 3);

        array_purge(array);
        assert(array_length(array) == 0);
        assert(array_is_empty(array));

        array_free(array);
    }

    {
        // unshift & shift
        array_t *array = make_array_with((free_fn_t *) string_free);

        char *A = string_copy("A");
        char *B = string_copy("B");
        char *C = string_copy("C");

        array_unshift(array, A);
        assert(array_length(array) == 1);
        array_unshift(array, B);
        assert(array_length(array) == 2);
        array_unshift(array, C);
        assert(array_length(array) == 3);

        assert(array_get(array, 0) == C);
        assert(array_get(array, 1) == B);
        assert(array_get(array, 2) == A);

        assert(array_shift(array) == C);
        assert(array_shift(array) == B);
        assert(array_shift(array) == A);

        assert(array_length(array) == 0);

        array_push(array, A);
        array_push(array, B);
        array_push(array, C);
        assert(array_shift(array) == A);
        assert(array_shift(array) == B);
        assert(array_shift(array) == C);

        array_unshift(array, A);
        array_unshift(array, B);
        array_unshift(array, C);
        assert(array_pop(array) == A);
        assert(array_pop(array) == B);
        assert(array_pop(array) == C);

        array_free(array);
    }

    {
        // cast atom value to void *.

        array_t *array = make_array();

        array_push(array, (void *) 1);
        array_push(array, (void *) 0);
        array_push(array, (void *) -1);

        assert(((int64_t) array_pop(array)) == -1);
        assert(((int64_t) array_pop(array)) == 0);
        assert(((int64_t) array_pop(array)) == 1);

        array_free(array);
    }

    {
        // array_put + auto grow

        array_t *array = make_array();

        array_put(array, 4, (void *) 1);
        assert(array_length(array) == 5);

        assert(array_get(array, 0) == NULL);
        assert(array_get(array, 1) == NULL);
        assert(array_get(array, 2) == NULL);
        assert(array_get(array, 3) == NULL);
        assert(array_get(array, 4) == (void *) 1);

        array_free(array);
    }

    {
        // array_put + auto grow -- again

        array_t *array = make_array();

        array_put(array, 0, (void *) 1);
        assert(array_length(array) == 1);

        assert(array_get(array, 0) == (void *) 1);

        array_free(array);
    }

    {
        // unshift & shift
        array_t *array = make_array_with((free_fn_t *) string_free);

        char *A = string_copy("A");
        char *B = string_copy("B");
        char *C = string_copy("C");

        array_push(array, A);
        array_push(array, B);
        array_push(array, C);

        assert(array_get(array, 0) == A);
        assert(array_get(array, 1) == B);
        assert(array_get(array, 2) == C);

        array_reverse(array);

        assert(array_get(array, 0) == C);
        assert(array_get(array, 1) == B);
        assert(array_get(array, 2) == A);

        array_free(array);
    }

    test_end();
}
