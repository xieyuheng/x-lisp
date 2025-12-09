#pragma once

struct cmd_ctx_t {
    const cmd_router_t *router;
    const cmd_route_t *route;
    size_t argc;
    char **argv;
    array_t *args;
    record_t *options;
};

cmd_ctx_t *cmd_make_ctx(
    const cmd_router_t *router,
    const cmd_route_t *route,
    size_t argc,
    char **argv);
void cmd_ctx_free(cmd_ctx_t *self);
