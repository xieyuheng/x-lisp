#pragma once

struct cli_route_t {
  const char *command;
  char *name;
  array_t *arg_names;
  array_t *option_names;
  cli_fn_t *fn;
};

cli_route_t *cli_parse_route(const char *command);
void cli_route_free(cli_route_t *self);

void cli_route_match(cli_route_t *self, cli_ctx_t *ctx);
