#include "index.h"

int
main(int argc, char *argv[]) {
    (void) argc;
    (void) argv;

    // sanity checks
    assert(sizeof(uint64_t) == sizeof(void *));
    assert(sizeof(uint64_t) == sizeof(uintptr_t));

    file_disable_buffer(stdout);
    file_disable_buffer(stderr);

    printf("x_true: %ld\n", (uint64_t) x_true);
    printf("x_false: %ld\n", (uint64_t) x_false);

    return 0;
}
