#include "index.h"

static void sanity_check(void) {
  assert(sizeof(uint64_t) == sizeof(void *));
  assert(sizeof(uint64_t) == sizeof(size_t));
}

static void handle_run_xvm(cli_ctx_t *ctx) {
  setup_current_command_line(ctx->passthrough);

  const char *pathname = cli_arg_get(ctx, 0);
  xvm_exe_t *exe = make_xvm_exe();
  xvm_exe_load(exe, pathname);
  mod_t *mod = xvm_exe_to_mod(exe);
  xvm_exe_free(exe);

  const char *entry = cli_option_get(ctx, "--entry");
  if (!entry) {
    entry = mod->entry_name;
  }

  if (!entry) {
    who_printf("no entry function specified\n");
    who_printf("  use --entry to specify the entry function\n");
    exit(1);
  }

  mod_call_entry(mod, entry);
}

static void handle_test_xvm(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  const char *snapshot = cli_option_get(ctx, "--snapshot");
  bool profile = cli_option_has(ctx, "--profile");
  bool builtin = cli_option_has(ctx, "--builtin");
  xvm_exe_t *exe = make_xvm_exe();
  xvm_exe_load(exe, pathname);
  mod_t *mod = xvm_exe_to_mod(exe);
  xvm_exe_free(exe);
  mod_test(mod, snapshot, profile, builtin);
}

int main(int argc, char *argv[]) {
  sanity_check();
  setbuf(stdout, NULL);
  setbuf(stderr, NULL);
  init_global_gc();

  setup_full_command_line((size_t) argc, argv);

  cli_router_t *router = cli_make_router("xvm2", "0.1.0");

  cli_define_route(router, "run file.xvm.exe --entry");
  cli_define_route(router, "test file.xvm.exe --profile --snapshot --builtin");

  cli_define_handler(router, "run", handle_run_xvm);
  cli_define_handler(router, "test", handle_test_xvm);

  cli_router_run(router, argc, argv);
  cli_router_free(router);
  return 0;
}