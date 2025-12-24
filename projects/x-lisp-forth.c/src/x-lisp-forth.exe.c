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

static void
handle_run(cmd_ctx_t *ctx) {
    char *file_name = cmd_arg(ctx, 0);
    mod_t *mod = load(make_path(file_name));
    (void) mod;
}

static void
init(void) {
    global_gc = make_gc();
    x_void = x_object(intern_hashtag("#void"));
}

int
main(int argc, char *argv[]) {
    sanity_check();
    config_stdio();

    init();

    cmd_router_t *router = cmd_make_router("x-lisp-forth", "0.1.0");

    cmd_define_route(router, "run file -- run a file");

    cmd_define_handler(router, "run", handle_run);

    cmd_router_run(router, argc, argv);
    cmd_router_free(router);
    return 0;
}
