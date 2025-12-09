#pragma once

struct cmd_route_t {
    const char *command;
    char *name;
    array_t *arg_names;
    array_t *option_names;
};
