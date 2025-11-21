#include "../src/index.h"

void _main(void);

int
main(int argc, char *argv[]) {
    (void) argc;
    (void) argv;

    file_disable_buffer(stdout);
    file_disable_buffer(stderr);

    _main();

    return 0;
}
