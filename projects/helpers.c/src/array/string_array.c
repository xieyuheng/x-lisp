#include "index.h"

array_t *
make_string_array(void) {
    return make_array_with((free_fn_t *) string_free);
}

void
string_array_print(array_t *array, const char *delimiter) {
    for (size_t i = 0; i < array_length(array); i++) {
        void *value = array_get(array, i);
        if (i + 1 == array_length(array)) {
            printf("%s", (char *) value);
        } else {
            printf("%s%s", (char *) value, delimiter);
        }
    }
}
