#include "index.h"

static void handle_hello(cli_ctx_t *ctx) {
  (void) ctx;
  printf("hello world\n");
}

static void handle_add(cli_ctx_t *ctx) {
  const char *arg0 = cli_arg_get(ctx, 0);
  const char *arg1 = cli_arg_get(ctx, 1);
  double x = string_parse_double(arg0);
  double y = string_parse_double(arg1);
  printf("%f\n", x + y);
}

static void handle_mul(cli_ctx_t *ctx) {
  const char *option_x = cli_option_get(ctx, "--x");
  if (!option_x) {
    printf("--x is required\n");
    exit(1);
  }

  const char *option_y = cli_option_get(ctx, "--y");
  if (!option_y) {
    printf("--y is required\n");
    exit(1);
  }

  double x = string_parse_double(option_x);
  double y = string_parse_double(option_y);
  printf("%f\n", x * y);
}

static void handle_bye(cli_ctx_t *ctx) {
  (void) ctx;
  printf("bye bye\n");
}

int main(int argc, char *argv[]) {
  cli_router_t *router = cli_make_router("calculator", "0.0.0");

  cli_define_route(router, "hello -- say hello");
  cli_define_route(router, "add x y -- add two numbers");
  cli_define_route(router, "mul --x --y -- mul two numbers");
  cli_define_route(router, "bye -- say bye bye");

  cli_define_handler(router, "hello", handle_hello);
  cli_define_handler(router, "add", handle_add);
  cli_define_handler(router, "mul", handle_mul);
  cli_define_handler(router, "bye", handle_bye);

  cli_router_run(router, argc, argv);
  cli_router_free(router);
  return 0;
}
