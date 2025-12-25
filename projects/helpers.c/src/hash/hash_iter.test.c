#include "index.h"

int
main(void) {
    test_start();

    {
        hash_t *hash = make_hash();
        hash_put_hash_fn(hash, (hash_fn_t *) string_hash_code);
        hash_put_key_equal_fn(hash, (equal_fn_t *) string_equal);

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
            assert(array_get(keys, 0) == array_get(keys_again, 0));
            assert(array_get(keys, 1) == array_get(keys_again, 1));
            assert(array_get(keys, 2) == array_get(keys_again, 2));
            assert(array_get(keys, 3) == array_get(keys_again, 3));
            array_free(keys_again);
        }

        {
            array_t *values_again = hash_values(hash);
            assert(array_get(values, 0) == array_get(values_again, 0));
            assert(array_get(values, 1) == array_get(values_again, 1));
            assert(array_get(values, 2) == array_get(values_again, 2));
            assert(array_get(values, 3) == array_get(values_again, 3));
            array_free(values_again);
        }

        {
            array_t *entries = hash_entries(hash);
            assert(array_get(keys, 0) == ((hash_entry_t *) array_get(entries, 0))->key);
            assert(array_get(keys, 1) == ((hash_entry_t *) array_get(entries, 1))->key);
            assert(array_get(keys, 2) == ((hash_entry_t *) array_get(entries, 2))->key);
            assert(array_get(keys, 3) == ((hash_entry_t *) array_get(entries, 3))->key);
            assert(array_get(values, 0) == ((hash_entry_t *) array_get(entries, 0))->value);
            assert(array_get(values, 1) == ((hash_entry_t *) array_get(entries, 1))->value);
            assert(array_get(values, 2) == ((hash_entry_t *) array_get(entries, 2))->value);
            assert(array_get(values, 3) == ((hash_entry_t *) array_get(entries, 3))->value);
            array_free(entries);
        }

        // iterate by insertion order.

        {
            size_t i = 0;
            hash_iter_t iter;
            hash_iter_init(&iter, hash);
            char *key = hash_iter_next_key(&iter);
            while (key) {
                assert(string_equal(key, array_get(keys, i)));
                key = hash_iter_next_key(&iter);
                i++;
            }
        }

        {
            size_t i = 0;
            hash_iter_t iter;
            hash_iter_init(&iter, hash);
            char *value = hash_iter_next_value(&iter);
            while (value) {
                assert(string_equal(value, array_get(values, i)));
                value = hash_iter_next_value(&iter);
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
