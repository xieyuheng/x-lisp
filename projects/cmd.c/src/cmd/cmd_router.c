#include "index.h"

cmd_router_t *
cmd_make_router(const char *name, const char *version) {
    cmd_router_t *self = new(cmd_router_t);
    self->name = name;
    self->version = version;
    self->routes = make_array_auto_with((free_fn_t *) cmd_route_free);
    return self;
}

void
cmd_router_free(cmd_router_t *self) {
    array_free(self->routes);
    free(self);
}

cmd_route_t *
cmd_router_lookup(cmd_router_t *self, const char *name) {
    for (size_t i = 0; i < array_length(self->routes); i++) {
        cmd_route_t *route = array_get(self->routes, i);
        if (string_equal(name, route->name)) {
            return route;
        }
    }

    return NULL;
}

static void
print_name_and_version(cmd_router_t *self) {
    printf("%s %s\n", self->name, self->version);
}

static void
print_commands(cmd_router_t *self) {
    printf("commands:\n");
    for (size_t i = 0; i < array_length(self->routes); i++) {
        cmd_route_t *route = array_get(self->routes, i);
        printf("  %s\n", route->command);
    }
}

void
cmd_router_run(cmd_router_t *self, size_t argc, char **argv) {
    if (argc < 2) {
        print_name_and_version(self);
        print_commands(self);
        return;
    }

    const char *name = argv[1];
    cmd_route_t *route = cmd_router_lookup(self, name);
    if (!route) {
        print_name_and_version(self);
        printf("unknown command: %s\n", name);
        print_commands(self);
        exit(1);
    }

    assert(route->fn);
    cmd_ctx_t *ctx = cmd_make_ctx(self, route, argc, argv);
    cmd_route_match(route, ctx);
    route->fn(ctx);
}
