#pragma once

struct cmd_router_t {
    const char *name;
    const char *version;

    array_t *routes;
    record_t *handlers;
};

cmd_router_t *cmd_make_router(const char *name, const char *version);
void cmd_router_free(cmd_router_t *self);

void cmd_router_run(cmd_router_t *self, size_t argc, const char **argv);
