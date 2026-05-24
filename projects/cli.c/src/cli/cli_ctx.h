#pragma once

struct cli_ctx_t {
  const cli_router_t *router;
  const cli_route_t *route;
  size_t argc;
  char **argv;
  array_t *args;
  record_t *options;
  array_t *passthrough;
};

cli_ctx_t *cli_make_ctx(
  const cli_router_t *router,
  const cli_route_t *route,
  size_t argc,
  char **argv);
void cli_ctx_free(cli_ctx_t *self);
