#include "index.h"

static void sanity_check(void) {
  assert(sizeof(uint64_t) == sizeof(void *));
  assert(sizeof(uint64_t) == sizeof(size_t));
}

static void handle_run(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);

  program_t *program = program_load(pathname);

  const char *entry = NULL;
  if (program_lookup_function(program, "main")) {
    entry = "main";
  } else if (program_lookup_function(program, "test")) {
    entry = "test";
  } else {
    who_printf("no entry function specified\n");
    who_printf("  add main/test to xvm asm source\n");
    exit(1);
  }

  setup_current_command_line(ctx->passthrough);
  program_call_entry(program, entry);
  program_free(program);
}

static void handle_test(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);

  program_t *program = program_load(pathname);
  program_call_entry(program, "test");
  program_free(program);
}

int main(int argc, char *argv[]) {
  sanity_check();
  setbuf(stdout, NULL);
  setbuf(stderr, NULL);
  init_global_gc();

  setup_full_command_line((size_t) argc, argv);

  cli_router_t *router = cli_make_router("xvm", "0.1.0");

  cli_define_route(router, "run file.xvm.exe");
  cli_define_route(router, "test file.xvm.exe");

  cli_define_handler(router, "run", handle_run);
  cli_define_handler(router, "test", handle_test);

  cli_router_run(router, argc, argv);
  cli_router_free(router);
  return 0;
}
