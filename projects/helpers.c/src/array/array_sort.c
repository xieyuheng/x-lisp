#include "index.h"

static void
partition(
    array_t *array, compare_fn_t *compare_fn,
    int64_t left, int64_t right,
    int64_t *less_pointer, int64_t *greater_pointer
) {
    void *pivot = array_get(array, (left + right) / 2);
    int64_t less = left;
    int64_t greater = right;
    int64_t i = left;
    while (i <= greater) {
        ordering_t ordering = compare_fn(array_get(array, i), pivot);
        if (ordering < 0) {
            array_swap(array, i, less);
            less++;
            i++;
        } else if (ordering > 0) {
            array_swap(array, i, greater);
            greater--;
        } else {
            i++;
        }
    }

    *less_pointer = less - 1;
    *greater_pointer = greater + 1;
}

static void
quicksort(
    array_t *array, compare_fn_t *compare_fn,
    int64_t left, int64_t right
) {
    if (left < right) {
        int64_t less, greater;
        partition(array, compare_fn, left, right, &less, &greater);
        quicksort(array, compare_fn, left, less);
        quicksort(array, compare_fn, greater, right);
    }
}

void
array_sort(array_t *array, compare_fn_t *compare_fn) {
    quicksort(array, compare_fn, 0, array_length(array) - 1);
}
