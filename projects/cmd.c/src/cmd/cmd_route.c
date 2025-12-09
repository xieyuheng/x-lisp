#include "index.h"

cmd_route_t *
cmd_parse_route(const char *command) {
    cmd_route_t *self = new(cmd_route_t);
    self->command = command;

    size_t cursor = 0;

    self->name = string_next_word(command, &cursor);
    assert(self->name);

    self->arg_names = make_string_array_auto();
    self->option_names = make_string_array_auto();

    char *word = string_next_word(command, &cursor);
    bool passed_args_p = false;
    while (word) {
        if (string_equal(word, "--")) {
            string_free(word);
            break;
        }

        if (string_starts_with(word, "-")) {
            passed_args_p = true;
            array_push(self->option_names, word);
        } else {
            assert(!passed_args_p);
            array_push(self->arg_names, word);
        }

        word = string_next_word(command, &cursor);
    }

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
    size_t base = 2;
    for (size_t i = 0; i < array_length(self->arg_names); i++) {
        const char *arg = ctx->argv[base + i];
        assert(arg);
        array_push(ctx->args, string_copy(arg));
    }

    base += array_length(self->arg_names);
    size_t cursor = base;
    while (cursor < ctx->argc) {
        const char *option_name = ctx->argv[cursor];
        const char *option_value = ctx->argv[cursor + 1];
        if (option_value == NULL || string_starts_with(option_value, "-")) {
            record_insert(ctx->options, option_name, NULL);
            cursor++;
        } else {
            record_insert(ctx->options, option_name, string_copy(option_value));
            cursor++;
            cursor++;
        }
    }
}
