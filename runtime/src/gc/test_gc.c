#include "index.h"

void
test_gc(void) {
    test_start();

    test_tuple();
    test_gc_copy();

    test_end();
}

void
make_example_tuples(gc_t *gc) {
    // EOC / Figure 6.5 / A copying collector in action.

    // Be careful! GC must not happen during this function,
    // because once GC happened, variables in this function will become invalid.
    // Thus this example function can NOT be used to test GC growing directly.

    tuple_t *r1 = tuple_new(2, gc);
    gc_push_root(gc, r1);

    tuple_t *r2 = tuple_new(3, gc);
    gc_push_root(gc, r2);

    tuple_t *r3 = tuple_new(2, gc);
    gc_push_root(gc, r3);

    tuple_t *t1 = tuple_new(2, gc);
    tuple_set_atom(t1, 0, true);
    tuple_set_atom(t1, 1, 42);

    tuple_t *t2 = tuple_new(2, gc);
    tuple_set_atom(t2, 0, 3);
    tuple_set_tuple(t2, 1, t1);

    tuple_set_tuple(r1, 0, r2);
    tuple_set_tuple(r1, 1, t1);

    tuple_set_atom(r2, 0, 7);
    tuple_set_atom(r2, 1, 5);
    tuple_set_tuple(r2, 2, t2);

    tuple_t *t3 = tuple_new(1, gc);
    tuple_set_atom(t3, 0, 8);

    tuple_set_tuple(r3, 0, t3);
    tuple_set_atom(r3, 1, 4);

    tuple_t *t4 = tuple_new(1, gc);
    tuple_set_atom(t4, 0, 5);

    tuple_t *t5 = tuple_new(1, gc);
    tuple_set_tuple(t5, 0, t4);

    tuple_t *t6 = tuple_new(2, gc);
    tuple_set_atom(t6, 0, 2);
    tuple_t *t7 = tuple_new(2, gc);
    tuple_set_tuple(t7, 0, t6);
    tuple_set_atom(t7, 1, 6);
    tuple_set_tuple(t6, 1, t7);
}

void
test_gc_copy(void) {
    test_start();

    gc_t *gc = gc_new(8, 32);
    gc_set_log_flag(gc, true);

    make_example_tuples(gc);

    gc_print(gc);
    tuple_new(3, gc);
    gc_print(gc);

    gc_grow(gc);
    gc_print(gc);

    test_end();
}
