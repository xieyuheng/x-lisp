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
    char *pathname = cmd_arg(ctx, 0);
    mod_t *mod = basic_load(make_path(pathname));
    basic_compile_loaded_mods();
    basic_setup_loaded_mods();
    basic_run(mod);
}

static void
handle_bytecode(cmd_ctx_t *ctx) {
    char *pathname = cmd_arg(ctx, 0);
    mod_t *mod = basic_load(make_path(pathname));
    basic_compile_loaded_mods();
    mod_inspect(mod);
}

static void
init(void) {
    init_global_gc();
    init_constant_values();
}

int
main(int argc, char *argv[]) {
    sanity_check();
    config_stdio();

    init();

    cmd_router_t *router = cmd_make_router("basic-lisp", "0.1.0");

    cmd_define_route(router, "run file -- run a file");
    cmd_define_route(router, "bytecode file -- show disassembled bytecode");

    cmd_define_handler(router, "run", handle_run);
    cmd_define_handler(router, "bytecode", handle_bytecode);

    cmd_router_run(router, argc, argv);
    cmd_router_free(router);
    return 0;
}
