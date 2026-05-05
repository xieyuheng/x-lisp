#include "index.h"

void cmd_define_route(cmd_router_t *router, const char *command) {
  cmd_route_t *route = cmd_parse_route(command);
  array_push(router->routes, route);
}

void cmd_define_handler(cmd_router_t *router, const char *name, cmd_fn_t *fn) {
  cmd_route_t *route = cmd_router_lookup(router, name);
  if (!route) {
    who_printf("undefined route %s\n", name);
    exit(1);
  }

  route->fn = fn;
}

const char *cmd_get_arg(cmd_ctx_t *ctx, size_t i) {
  return array_get(ctx->args, i);
}

size_t cmd_count_args(cmd_ctx_t *ctx) {
  return array_length(ctx->args);
}

bool cmd_has_option(cmd_ctx_t *ctx, const char *name) {
  return record_has(ctx->options, name);
}

const char *cmd_get_option(cmd_ctx_t *ctx, const char *name) {
  return record_get(ctx->options, name);
}
