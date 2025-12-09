#pragma once

struct cmd_route_t {
    const char *command;
    char *name;
    array_t *arg_names;
    array_t *option_names;
    cmd_fn_t *fn;
};

cmd_route_t *cmd_parse_route(const char *command);
void cmd_route_free(cmd_route_t *self);
