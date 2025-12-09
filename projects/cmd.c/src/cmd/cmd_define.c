#include "index.h"

void
cmd_define_route(cmd_router_t *router, const char *command) {
    cmd_route_t *route = cmd_parse_route(command);
    array_push(router->routes, route);
}
