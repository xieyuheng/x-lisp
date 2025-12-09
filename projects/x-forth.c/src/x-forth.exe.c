#include "index.h"

static void
sanity_check(void) {
    assert(sizeof(uint64_t) == sizeof(void *));
    assert(sizeof(uint64_t) == sizeof(size_t));
}

static void
config_stdio(void) {
    file_disable_buffer(stdout);
    file_disable_buffer(stderr);
}

int
main(int argc, char *argv[]) {
    sanity_check();
    config_stdio();

    cmd_router_t *router = cmd_make_router("x-forth", "0.1.0");

    cmd_define_route(router, "run file -- run a file");

    cmd_router_run(router, argc, argv);
    cmd_router_free(router);
    return 0;
}
