#include "index.h"

array_t *
make_string_array_auto(void) {
    return make_array_auto_with((free_fn_t *) string_free);
}

void
string_array_print(array_t *array, const char *delimiter, file_t *file) {
    for (size_t i = 0; i < array_length(array); i++) {
        void *value = array_get(array, i);
        if (i + 1 == array_length(array)) {
            fprintf(file, "%s", (char *) value);
        } else {
            fprintf(file, "%s%s", (char *) value, delimiter);
        }
    }
}
