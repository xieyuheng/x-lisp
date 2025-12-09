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

void
cmd_router_run(cmd_router_t *self, size_t argc, const char **argv) {
    if (argc < 2) {
        where_printf("TODO print help message\n");
        return;
    }

    const char *name = argv[1];

    for (size_t i = 0; array_length(self->routes); i++) {
        cmd_route_t *route = array_get(self->routes, i);
        if (string_equal(name, route->name)) {
            cmd_ctx_t *ctx = cmd_make_ctx(self, route, argc, argv);
            // cmd_route_match(route, ctx);
            assert(route->fn);
            route->fn(ctx);
        }
    }

    who_printf("unknown command name: %s\n", name);
    exit(1);
}
