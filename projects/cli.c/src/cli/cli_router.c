#include "index.h"

cli_router_t *cli_make_router(const char *name, const char *version) {
  cli_router_t *self = new(cli_router_t);
  self->name = name;
  self->version = version;
  self->routes = make_array_with((free_fn_t *) cli_route_free);
  return self;
}

void cli_router_free(cli_router_t *self) {
  array_free(self->routes);
  free(self);
}

cli_route_t *cli_router_lookup(cli_router_t *self, const char *name) {
  for (size_t i = 0; i < array_length(self->routes); i++) {
    cli_route_t *route = array_get(self->routes, i);
    if (string_equal(name, route->name)) {
      return route;
    }
  }

  return NULL;
}

static void print_name_and_version(cli_router_t *self) {
  printf("%s %s\n", self->name, self->version);
}

static void print_commands(cli_router_t *self) {
  printf("commands:\n");
  for (size_t i = 0; i < array_length(self->routes); i++) {
    cli_route_t *route = array_get(self->routes, i);
    printf("  %s\n", route->command);
  }
}

void cli_router_run(cli_router_t *self, size_t argc, char **argv) {
  if (argc < 2) {
    print_name_and_version(self);
    print_commands(self);
    return;
  }

  const char *name = argv[1];
  cli_route_t *route = cli_router_lookup(self, name);
  if (!route) {
    print_name_and_version(self);
    printf("unknown command: %s\n", name);
    print_commands(self);
    exit(1);
  }

  if (!route->fn) {
    who_printf("missing handler for command: %s\n", name);
    exit(1);
  }

  cli_ctx_t *ctx = cli_make_ctx(self, route, argc, argv);
  cli_route_match(route, ctx);
  route->fn(ctx);
}
