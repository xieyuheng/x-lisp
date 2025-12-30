#include "index.h"

int
main(void) {
    test_start();

    {
        set_t *set = make_set();
        assert(set_size(set) == 0);

        assert(set_add(set, (void *) 1));
        assert(set_add(set, (void *) 2));
        assert(set_add(set, (void *) 3));

        assert(set_size(set) == 3);

        assert(!set_add(set, (void *) 1));
        assert(!set_add(set, (void *) 2));
        assert(!set_add(set, (void *) 3));

        assert(set_size(set) == 3);

        assert(set_member(set, (void *) 1));
        assert(set_member(set, (void *) 2));
        assert(set_member(set, (void *) 3));

        assert(!set_member(set, (void *) 0));
        assert(!set_member(set, (void *) 4));

        assert(set_delete(set, (void *) 2));
        assert(set_delete(set, (void *) 3));

        assert(!set_delete(set, (void *) 2));
        assert(!set_delete(set, (void *) 3));

        assert(set_size(set) == 1);

        assert(set_member(set, (void *) 1));
        assert(!set_member(set, (void *) 2));
        assert(!set_member(set, (void *) 3));

        set_free(set);
    }

    test_end();
}
