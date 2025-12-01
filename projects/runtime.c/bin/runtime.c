#include "../src/index.h"

void _setup(void);
void _main(void);

int
main(int argc, char *argv[]) {
    (void) argc;
    (void) argv;

    // sanity checks
    assert(sizeof(uint64_t) == sizeof(void *));

    file_disable_buffer(stdout);
    file_disable_buffer(stderr);

    _setup();
    _main();

    return 0;
}
