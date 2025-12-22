#include "index.h"

int
main(void) {
    test_start();

    list_t *list = make_list();
    char *cheese = string_copy("cheese");
    char *bread = string_copy("bread");
    char *wine = string_copy("wine");

    list_push(list, cheese);
    list_push(list, bread);
    list_push(list, wine);

    {
        // allocate iter on stack.
        list_iter_t iter;
        list_iter_init(&iter, list);
        char *value = list_iter_next(&iter);
        size_t i = 0;
        while (value) {
            assert(string_equal(value, list_get(list, i)));
            value = list_iter_next(&iter);
            i++;
        }
    }

    {
        // allocate iter on heap.
        list_iter_t* iter = make_list_iter(list);
        char *value = list_iter_next(iter);
        size_t i = 0;
        while (value) {
            assert(string_equal(value, list_get(list, i)));
            value = list_iter_next(iter);
            i++;
        }

        list_iter_free(iter);
    }

    test_end();
}
