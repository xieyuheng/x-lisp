#include "index.h"

cmd_route_t *
cmd_parse_route(const char *command) {
    cmd_route_t *self = new(cmd_route_t);
    self->command = command;
    self->name = NULL; // TOOD
    self->arg_names = make_string_array_auto(); // TOOD
    self->option_names = make_string_array_auto(); // TOOD
    return self;
}

void
cmd_route_free(cmd_route_t *self) {
    string_free(self->name);
    array_free(self->arg_names);
    array_free(self->option_names);
    free(self);
}

void
cmd_route_match(cmd_route_t *self, cmd_ctx_t *ctx) {
    for (size_t i = 0; i < array_length(self->arg_names); i++) {
        const char *arg = ctx->argv[1 + i];
        assert(arg);
        array_push(ctx->args, string_copy(arg));
    }

    // TODO handle options
}
