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
    size_t base = 1;
    for (size_t i = 0; i < array_length(self->arg_names); i++) {
        const char *arg = ctx->argv[base + i];
        assert(arg);
        array_push(ctx->args, string_copy(arg));
    }

    base += array_length(self->arg_names);
    size_t index = base;
    while (index < ctx->argc) {
        const char *option_name = ctx->argv[base + index];
        const char *option_value = ctx->argv[base + index + 1];
        if (option_value == NULL || string_starts_with(option_value, "-")) {
            record_insert(ctx->options, option_name, NULL);
            index++;
        } else {
            record_insert(ctx->options, option_name, string_copy(option_value));
            index++;
            index++;
        }
    }
}
