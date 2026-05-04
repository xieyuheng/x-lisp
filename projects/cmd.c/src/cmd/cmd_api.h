#pragma once

void cmd_define_route(cmd_router_t *router, const char *command);
void cmd_define_handler(cmd_router_t *router, const char *name, cmd_fn_t *fn);

char *cmd_get_arg(cmd_ctx_t *ctx, size_t i);
size_t cmd_count_args(cmd_ctx_t *ctx);

bool cmd_has_option(cmd_ctx_t *ctx, const char *name);
char *cmd_get_option(cmd_ctx_t *ctx, const char *name);
