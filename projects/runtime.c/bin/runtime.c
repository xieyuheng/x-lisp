#include "../src/index.h"

void _setup(void);
void _main(void);

int
main(int argc, char *argv[]) {
    (void) argc;
    (void) argv;

    file_disable_buffer(stdout);
    file_disable_buffer(stderr);

    _setup();
    _main();

    return 0;
}
