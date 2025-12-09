#pragma once

void cmd_define_route(cmd_router_t *router, const char *command);
void cmd_define_handler(cmd_router_t *router, const char *name, cmd_fn_t *fn);
