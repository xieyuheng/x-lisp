#include "index.h"

int
main(void) {
    test_start();

    {
        hash_t *hash = make_hash();
        hash_put_hash_fn(hash, (hash_fn_t *) string_bernstein_hash);
        hash_put_key_equal_fn(hash, (equal_fn_t *) string_equal);

        assert(!hash_first_value(hash));

        //  Insert some entries

        array_t *keys = make_string_array();
        array_push(keys, string_copy("DEADBEEF"));
        array_push(keys, string_copy("ABADCAFE"));
        array_push(keys, string_copy("C0DEDBAD"));
        array_push(keys, string_copy("DEADF00D"));

        array_t *values = make_string_array();
        array_push(values, string_copy("dead beef"));
        array_push(values, string_copy("a bad cafe"));
        array_push(values, string_copy("coded bad"));
        array_push(values, string_copy("dead food"));

        assert(hash_insert(hash, array_get(keys, 0), array_get(values, 0)));
        assert(hash_insert(hash, array_get(keys, 1), array_get(values, 1)));
        assert(hash_insert(hash, array_get(keys, 2), array_get(values, 2)));
        assert(hash_insert(hash, array_get(keys, 3), array_get(values, 3)));

        assert(hash_length(hash) == 4);

        {
            array_t *keys_again = hash_keys(hash);
            assert(string_equal(array_get(keys, 0), array_get(keys_again, 0)));
            assert(string_equal(array_get(keys, 1), array_get(keys_again, 1)));
            assert(string_equal(array_get(keys, 2), array_get(keys_again, 2)));
            assert(string_equal(array_get(keys, 3), array_get(keys_again, 3)));
            array_free(keys_again);
        }

        {
            array_t *values_again = hash_values(hash);
            assert(string_equal(array_get(values, 0), array_get(values_again, 0)));
            assert(string_equal(array_get(values, 1), array_get(values_again, 1)));
            assert(string_equal(array_get(values, 2), array_get(values_again, 2)));
            assert(string_equal(array_get(values, 3), array_get(values_again, 3)));
            array_free(values_again);
        }

        // iterate by insertion order.

        {
            size_t i = 0;
            char *key = hash_first_key(hash);
            while (key) {
                assert(string_equal(key, array_get(keys, i)));
                key = hash_next_key(hash);
                i++;
            }
        }

        {
            size_t i = 0;
            char *value = hash_first_value(hash);
            while (value) {
                assert(string_equal(value, array_get(values, i)));
                value = hash_next_value(hash);
                i++;
            }
        }

        array_free(keys);
        array_free(values);

        hash_purge(hash);
        assert(hash_length(hash) == 0);
        hash_free(hash);
    }

    test_end();
}
