#include "index.h"

int
main(int argc, char *argv[]) {
    (void) argc;
    (void) argv;

    // sanity checks
    assert(sizeof(uint64_t) == sizeof(void *));

    file_disable_buffer(stdout);
    file_disable_buffer(stderr);

    printf("hi\n");

    return 0;
}
