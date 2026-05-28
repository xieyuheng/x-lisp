#pragma once

struct cli_router_t {
  const char *name;
  const char *version;
  array_t *routes;
};

cli_router_t *cli_make_router(const char *name, const char *version);
void cli_router_free(cli_router_t *self);

cli_route_t *cli_router_lookup(cli_router_t *self, const char *name);
void cli_router_run(cli_router_t *self, size_t argc, char **argv);
