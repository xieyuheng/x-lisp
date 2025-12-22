#include "index.h"

int
main(void) {
    test_start();

    {
        record_t *record = make_record();
        assert(record_length(record) == 0);

        assert(record_insert(record, "a", (void *) 1));
        assert(record_insert(record, "b", (void *) 2));
        assert(record_insert(record, "c", (void *) 3));
        assert(record_length(record) == 3);

        assert(string_equal(record_get(record, "a"), (void *) 1));
        assert(string_equal(record_get(record, "b"), (void *) 2));
        assert(string_equal(record_get(record, "c"), (void *) 3));

        assert(!record_insert(record, "b", (void *) 4));
        assert(string_equal(record_get(record, "b"), (void *) 2));

        record_put(record, "b", (void *) 4);
        assert(string_equal(record_get(record, "b"), (void *) 4));

        record_delete(record, "b");
        assert(!record_get(record, "b"));
        assert(record_length(record) == 2);

        record_purge(record);
        assert(record_length(record) == 0);
        record_free(record);
    }

    {
        record_t *record = make_record();
        record_put_free_fn(record, (free_fn_t *) string_free);

        //  Insert some entries
        assert(record_insert(record, "DEADBEEF", string_copy("dead beef")));
        assert(record_insert(record, "ABADCAFE", string_copy("a bad cafe")));
        assert(record_insert(record, "C0DEDBAD", string_copy("coded bad")));
        assert(record_insert(record, "DEADF00D", string_copy("dead food")));
        assert(record_length(record) == 4);

        //  Look for existing entries
        assert(string_equal(record_get(record, "DEADBEEF"), "dead beef"));
        assert(string_equal(record_get(record, "ABADCAFE"), "a bad cafe"));
        assert(string_equal(record_get(record, "C0DEDBAD"), "coded bad"));
        assert(string_equal(record_get(record, "DEADF00D"), "dead food"));

        //  Look for non-existent entries
        assert(!record_get(record, "foo"));

        //  Try to insert duplicate entries
        assert(!record_insert(record, "DEADBEEF", string_copy("foo")));
        assert(string_equal(record_get(record, "DEADBEEF"), "dead beef"));

        //  Put duplicate entries
        record_put(record, "DEADBEEF", string_copy("foo"));
        assert(string_equal(record_get(record, "DEADBEEF"), "foo"));

        //  Delete entries
        record_delete(record, "DEADBEEF");
        assert(!record_get(record, "DEADBEEF"));
        record_delete(record, "ABADCAFE");
        assert(!record_get(record, "ABADCAFE"));
        assert(record_length(record) == 2);

        record_purge(record);
        assert(record_length(record) == 0);
        record_free(record);
    }

    {
        record_t *record = make_record();
        assert(!record_first_value(record));

        //  Insert some entries

        array_t *keys = make_string_array_auto();
        array_push(keys, string_copy("DEADBEEF"));
        array_push(keys, string_copy("ABADCAFE"));
        array_push(keys, string_copy("C0DEDBAD"));
        array_push(keys, string_copy("DEADF00D"));

        array_t *values = make_string_array_auto();
        array_push(values, string_copy("dead beef"));
        array_push(values, string_copy("a bad cafe"));
        array_push(values, string_copy("coded bad"));
        array_push(values, string_copy("dead food"));

        assert(record_insert(record, array_get(keys, 0), array_get(values, 0)));
        assert(record_insert(record, array_get(keys, 1), array_get(values, 1)));
        assert(record_insert(record, array_get(keys, 2), array_get(values, 2)));
        assert(record_insert(record, array_get(keys, 3), array_get(values, 3)));

        assert(record_length(record) == 4);

        // iterate by insertion order.

        {
            size_t i = 0;
            char *key = record_first_key(record);
            while (key) {
                assert(string_equal(key, array_get(keys, i)));
                key = record_next_key(record);
                i++;
            }
        }

        {
            size_t i = 0;
            char *value = record_first_value(record);
            while (value) {
                assert(string_equal(value, array_get(values, i)));
                value = record_next_value(record);
                i++;
            }
        }

        array_free(keys);
        array_free(values);

        record_purge(record);
        assert(record_length(record) == 0);
        record_free(record);
    }

    test_end();
}
