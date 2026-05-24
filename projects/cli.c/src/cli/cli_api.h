#pragma once

void cli_define_route(cli_router_t *router, const char *command);
void cli_define_handler(cli_router_t *router, const char *name, cli_fn_t *fn);

const char *cli_get_arg(cli_ctx_t *ctx, size_t i);
size_t cli_count_args(cli_ctx_t *ctx);

bool cli_has_option(cli_ctx_t *ctx, const char *name);
const char *cli_get_option(cli_ctx_t *ctx, const char *name);
