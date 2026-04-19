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
    char *pathname = cmd_get_arg(ctx, 0);
    mod_t *mod = linn_load(make_path(pathname));
    (void) mod;
}

static void
handle_run_function(cmd_ctx_t *ctx){
    char *name = cmd_get_arg(ctx, 0);
    char *pathname = cmd_get_arg(ctx, 1);
    mod_t *mod = linn_load(make_path(pathname));
    linn_run_function(mod, name);
}

static void
init(void) {
    init_global_gc();
}

int
main(int argc, char *argv[]) {
    sanity_check();
    config_stdio();

    init();

    cmd_router_t *router = cmd_make_router("linn", "0.1.0");

    cmd_define_route(router, "run file");
    cmd_define_route(router, "run-function function file");

    cmd_define_handler(router, "run", handle_run);
    cmd_define_handler(router, "run-function", handle_run_function);

    cmd_router_run(router, argc, argv);
    cmd_router_free(router);
    return 0;
}
