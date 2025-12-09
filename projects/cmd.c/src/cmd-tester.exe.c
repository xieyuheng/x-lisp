#include "index.h"

void
sanity_check(void) {
    assert(sizeof(uint64_t) == sizeof(void *));
    assert(sizeof(uint64_t) == sizeof(size_t));
}

void
config_stdio(void) {
    file_disable_buffer(stdout);
    file_disable_buffer(stderr);
}

static cmd_fn_t handle_hello;
static cmd_fn_t handle_bye;

int
main(int argc, char *argv[]) {
    sanity_check();
    config_stdio();

    cmd_router_t *router = cmd_make_router("cmd-tester", "0.0.0");

    cmd_define_route(router, "hello -- say hello");
    cmd_define_route(router, "bye -- say bye bye");

    (void) handle_hello;
    (void) handle_bye;

    // cmd_define_handler(router, "hello", handle_hello);
    // cmd_define_handler(router, "bye", handle_bye);

    cmd_router_run(router, argc, argv);
    cmd_router_free(router);
    return 0;
}

static void
handle_hello(cmd_ctx_t *ctx) {
    (void) ctx;
    printf("hello world\n");
}

static void
handle_bye(cmd_ctx_t *ctx) {
    (void) ctx;
    printf("bye bye\n");
}
