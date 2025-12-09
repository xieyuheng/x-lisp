#include "index.h"

void
cmd_define_route(cmd_router_t *router, const char *command) {
    cmd_route_t *route = cmd_parse_route(command);
    array_push(router->routes, route);
}

void
cmd_define_handler(cmd_router_t *router, const char *name, cmd_fn_t *fn) {
    cmd_route_t *route = cmd_router_lookup(router, name);
    assert(route);
    route->fn = fn;
}
