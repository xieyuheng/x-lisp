#include "index.h"

void cli_define_route(cli_router_t *router, const char *command) {
  cli_route_t *route = cli_parse_route(command);
  array_push(router->routes, route);
}

void cli_define_handler(cli_router_t *router, const char *name, cli_fn_t *fn) {
  cli_route_t *route = cli_router_lookup(router, name);
  if (!route) {
    who_printf("undefined route %s\n", name);
    exit(1);
  }

  route->fn = fn;
}

bool cli_option_has(cli_ctx_t *ctx, const char *name) {
  return record_has(ctx->options, name);
}

const char *cli_option_get(cli_ctx_t *ctx, const char *name) {
  return record_get(ctx->options, name);
}

size_t cli_arg_count(cli_ctx_t *ctx) {
  return array_length(ctx->args);
}

const char *cli_arg_get(cli_ctx_t *ctx, size_t i) {
  return array_get(ctx->args, i);
}

size_t cli_passthrough_count(cli_ctx_t *ctx) {
  return array_length(ctx->passthrough);
}

const char *cli_passthrough_get(cli_ctx_t *ctx, size_t i) {
  return array_get(ctx->passthrough, i);
}
