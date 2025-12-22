#include "index.h"

int
main(void) {
    test_start();

    // {
    //     record_t *record = make_record();
    //     assert(!record_first_value(record));

    //     //  Insert some entries

    //     array_t *keys = make_string_array();
    //     array_push(keys, string_copy("DEADBEEF"));
    //     array_push(keys, string_copy("ABADCAFE"));
    //     array_push(keys, string_copy("C0DEDBAD"));
    //     array_push(keys, string_copy("DEADF00D"));

    //     array_t *values = make_string_array();
    //     array_push(values, string_copy("dead beef"));
    //     array_push(values, string_copy("a bad cafe"));
    //     array_push(values, string_copy("coded bad"));
    //     array_push(values, string_copy("dead food"));

    //     assert(record_insert(record, array_get(keys, 0), array_get(values, 0)));
    //     assert(record_insert(record, array_get(keys, 1), array_get(values, 1)));
    //     assert(record_insert(record, array_get(keys, 2), array_get(values, 2)));
    //     assert(record_insert(record, array_get(keys, 3), array_get(values, 3)));

    //     assert(record_length(record) == 4);

    //     {
    //         array_t *keys_again = record_keys(record);
    //         assert(string_equal(array_get(keys, 0), array_get(keys_again, 0)));
    //         assert(string_equal(array_get(keys, 1), array_get(keys_again, 1)));
    //         assert(string_equal(array_get(keys, 2), array_get(keys_again, 2)));
    //         assert(string_equal(array_get(keys, 3), array_get(keys_again, 3)));
    //         array_free(keys_again);
    //     }

    //     {
    //         array_t *values_again = record_values(record);
    //         assert(string_equal(array_get(values, 0), array_get(values_again, 0)));
    //         assert(string_equal(array_get(values, 1), array_get(values_again, 1)));
    //         assert(string_equal(array_get(values, 2), array_get(values_again, 2)));
    //         assert(string_equal(array_get(values, 3), array_get(values_again, 3)));
    //         array_free(values_again);
    //     }

    //     // iterate by insertion order.

    //     {
    //         size_t i = 0;
    //         const char *key = record_first_key(record);
    //         while (key) {
    //             assert(string_equal(key, array_get(keys, i)));
    //             key = record_next_key(record);
    //             i++;
    //         }
    //     }

    //     {
    //         size_t i = 0;
    //         char *value = record_first_value(record);
    //         while (value) {
    //             assert(string_equal(value, array_get(values, i)));
    //             value = record_next_value(record);
    //             i++;
    //         }
    //     }

    //     array_free(keys);
    //     array_free(values);

    //     record_purge(record);
    //     assert(record_length(record) == 0);
    //     record_free(record);
    // }

    test_end();
}
