#include "index.h"

cmd_route_t *cmd_parse_route(const char *command) {
  cmd_route_t *self = new(cmd_route_t);
  self->command = command;

  size_t cursor = 0;

  self->name = string_next_word(command, &cursor);
  assert(self->name);

  self->arg_names = make_string_array();
  self->option_names = make_string_array();

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

void cmd_route_free(cmd_route_t *self) {
  string_free(self->name);
  array_free(self->arg_names);
  array_free(self->option_names);
  free(self);
}

static void match_arg(cmd_ctx_t *ctx, size_t *cursor_pointer) {
  size_t cursor = *cursor_pointer;
  const char *token = ctx->argv[cursor];
  array_push(ctx->args, string_copy(token));
  *cursor_pointer = cursor + 1;
}

static void match_option(cmd_ctx_t *ctx, size_t *cursor_pointer) {
  size_t cursor = *cursor_pointer;
  const char *token = ctx->argv[cursor];
  if (cursor + 1 >= ctx->argc) {
    record_insert(ctx->options, token, NULL);
    *cursor_pointer = cursor + 1;
    return;
  }

  const char *next_token = ctx->argv[cursor + 1];
  if (string_starts_with(next_token, "-")) {
    record_insert(ctx->options, token, NULL);
    *cursor_pointer = cursor + 1;
  } else {
    record_insert(ctx->options, token, string_copy(next_token));
    *cursor_pointer = cursor + 2;
  }
}

void cmd_route_match(cmd_route_t *self, cmd_ctx_t *ctx) {
  (void) self;
  size_t cursor = 2;
  while (cursor < ctx->argc) {
    const char *token = ctx->argv[cursor];
    if (string_starts_with(token, "-")) {
      match_option(ctx, &cursor);
    } else {
      match_arg(ctx, &cursor);
    }
  }
}
