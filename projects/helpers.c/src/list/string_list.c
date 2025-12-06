#include "index.h"

list_t *
make_string_list(void) {
    return make_list_with((free_fn_t *) string_free);
}

list_t *
string_list_copy(list_t *list) {
    list_put_copy_fn(list, (copy_fn_t *) string_copy);
    return list_copy(list);
}

void
string_list_print(list_t *list, const char *delimiter) {
    void *value = list_first(list);
    while (value) {
        if (list_cursor_is_end(list)) {
            printf("%s", (char *) value);
        } else {
            printf("%s%s", (char *) value, delimiter);
        }

        value = list_next(list);
    }
}
