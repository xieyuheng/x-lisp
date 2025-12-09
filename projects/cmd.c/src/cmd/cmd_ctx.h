#pragma once

struct cmd_ctx_t {
    cmd_router_t *router;
    cmd_route_t *route;
    size_t argc;
    const char **argv;
    array_t *args;
    record_t *options;
};
