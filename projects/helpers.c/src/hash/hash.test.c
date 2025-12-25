#include "index.h"

int
main(void) {
    test_start();

    {
        hash_t *hash = make_hash();
        assert(hash_length(hash) == 0);

        void *k1 = (void *) 1;
        void *k2 = (void *) 2;
        void *k3 = (void *) 3;

        assert(hash_insert(hash, k1, string_copy("a")));
        assert(hash_insert(hash, k2, string_copy("b")));
        assert(hash_insert(hash, k3, string_copy("c")));
        assert(hash_length(hash) == 3);

        assert(string_equal(hash_get(hash, k1), "a"));
        assert(string_equal(hash_get(hash, k2), "b"));
        assert(string_equal(hash_get(hash, k3), "c"));

        assert(!hash_insert(hash, k2, string_copy("d")));
        assert(string_equal(hash_get(hash, k2), "b"));

        hash_put(hash, k2, string_copy("d"));
        assert(string_equal(hash_get(hash, k2), "d"));

        hash_delete(hash, k2);
        assert(!hash_get(hash, k2));
        assert(hash_length(hash) == 2);

        hash_purge(hash);
        assert(hash_length(hash) == 0);
        hash_free(hash);
    }

    {
        hash_t *hash = make_hash();

        size_t length = 1000 * 1000;
        for (size_t i = 0; i < length; i++)
            hash_insert(hash, (void *) i, (void *) i);

        for (size_t i = 0; i < length; i++)
            assert(hash_get(hash, (void *) i) == (void *) i);

        hash_report(hash);

        hash_purge(hash);
        assert(hash_length(hash) == 0);
        hash_free(hash);
    }

    {
        hash_t *hash = make_hash();

        size_t length = 1000 * 1000;
        for (size_t i = 0; i < length; i++)
            hash_insert(hash, (void *) (uint64_t) rand(), (void *) i);

        hash_report(hash);

        hash_purge(hash);
        assert(hash_length(hash) == 0);
        hash_free(hash);
    }

    {
        hash_t *hash = make_hash();
        hash_put_hash_fn(hash, (hash_fn_t *) string_hash_code);
        hash_put_value_free_fn(hash, (free_fn_t *) string_free);
        hash_put_key_free_fn(hash, (free_fn_t *) string_free);
        hash_put_key_equal_fn(hash, (equal_fn_t *) string_equal);

        //  Insert some entries
        assert(hash_insert(hash, string_copy("DEADBEEF"), string_copy("dead beef")));
        assert(hash_insert(hash, string_copy("ABADCAFE"), string_copy("a bad cafe")));
        assert(hash_insert(hash, string_copy("C0DEDBAD"), string_copy("coded bad")));
        assert(hash_insert(hash, string_copy("DEADF00D"), string_copy("dead food")));
        assert(hash_length(hash) == 4);

        //  Look for existing entries
        assert(string_equal(hash_get(hash, "DEADBEEF"), "dead beef"));
        assert(string_equal(hash_get(hash, "ABADCAFE"), "a bad cafe"));
        assert(string_equal(hash_get(hash, "C0DEDBAD"), "coded bad"));
        assert(string_equal(hash_get(hash, "DEADF00D"), "dead food"));

        //  Look for non-existent entries
        assert(!hash_get(hash, "foo"));

        //  Try to insert duplicate entries
        assert(!hash_insert(hash, string_copy("DEADBEEF"), string_copy("foo")));
        assert(string_equal(hash_get(hash, "DEADBEEF"), "dead beef"));

        //  Put duplicate entries
        hash_put(hash, string_copy("DEADBEEF"), string_copy("foo"));
        assert(string_equal(hash_get(hash, "DEADBEEF"), "foo"));

        //  Delete entries
        hash_delete(hash, "DEADBEEF");
        assert(!hash_get(hash, "DEADBEEF"));
        hash_delete(hash, "ABADCAFE");
        assert(!hash_get(hash, "ABADCAFE"));
        assert(hash_length(hash) == 2);

        hash_purge(hash);
        assert(hash_length(hash) == 0);
        hash_free(hash);
    }

    test_end();
}
