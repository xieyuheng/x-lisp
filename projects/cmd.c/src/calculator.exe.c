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

static void
handle_hello(cmd_ctx_t *ctx) {
    (void) ctx;
    printf("hello world\n");
}

static void
handle_add(cmd_ctx_t *ctx) {
    char *arg0 = cmd_arg(ctx, 0);
    char *arg1 = cmd_arg(ctx, 1);
    double x = string_parse_double(arg0);
    double y = string_parse_double(arg1);
    printf("%f\n", x + y);
}

static void
handle_mul(cmd_ctx_t *ctx) {
    char *option_x = cmd_option(ctx, "--x");
    if (!option_x) {
        printf("--x is required\n");
        exit(1);
    }

    char *option_y = cmd_option(ctx, "--y");
    if (!option_y) {
        printf("--y is required\n");
        exit(1);
    }

    double x = string_parse_double(option_x);
    double y = string_parse_double(option_y);
    printf("%f\n", x * y);
}

static void
handle_bye(cmd_ctx_t *ctx) {
    (void) ctx;
    printf("bye bye\n");
}

int
main(int argc, char *argv[]) {
    sanity_check();
    config_stdio();

    cmd_router_t *router = cmd_make_router("calculator", "0.0.0");

    cmd_define_route(router, "hello -- say hello");
    cmd_define_route(router, "add x y -- add two numbers");
    cmd_define_route(router, "mul --x --y -- mul two numbers");
    cmd_define_route(router, "bye -- say bye bye");

    cmd_define_handler(router, "hello", handle_hello);
    cmd_define_handler(router, "add", handle_add);
    cmd_define_handler(router, "mul", handle_mul);
    cmd_define_handler(router, "bye", handle_bye);

    cmd_router_run(router, argc, argv);
    cmd_router_free(router);
    return 0;
}
