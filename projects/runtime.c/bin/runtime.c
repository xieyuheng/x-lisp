#include "../src/index.h"

void __main(void);

int
main(int argc, char *argv[]) {
    (void) argc;
    (void) argv;

    file_disable_buffer(stdout);
    file_disable_buffer(stderr);

    __main();

    return 0;
}
