#pragma once

struct cmd_router_t {
    const char *name;
    const char *version;
    array_t *routes;
};

cmd_router_t *cmd_make_router(const char *name, const char *version);
void cmd_router_free(cmd_router_t *self);

cmd_route_t *cmd_router_lookup(cmd_router_t *self, const char *name);
void cmd_router_run(cmd_router_t *self, size_t argc, char **argv);
