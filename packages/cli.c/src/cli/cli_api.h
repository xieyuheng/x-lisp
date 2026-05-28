#pragma once

void cli_define_route(cli_router_t *router, const char *command);
void cli_define_handler(cli_router_t *router, const char *name, cli_fn_t *fn);

bool cli_option_has(cli_ctx_t *ctx, const char *name);
const char *cli_option_get(cli_ctx_t *ctx, const char *name);

size_t cli_arg_count(cli_ctx_t *ctx);
const char *cli_arg_get(cli_ctx_t *ctx, size_t i);

size_t cli_passthrough_count(cli_ctx_t *ctx);
const char *cli_passthrough_get(cli_ctx_t *ctx, size_t i);
