#include "index.h"

static void sanity_check(void) {
  assert(sizeof(uint64_t) == sizeof(void *));
  assert(sizeof(uint64_t) == sizeof(size_t));
}

static char *build_output_pathname(const char *input) {
  size_t len = string_length(input);
  if (len > 8 && string_equal(input + len - 8, ".xvm.asm")) {
    char *output = allocate(len + 1);
    memory_copy(output, input, len - 8);
    memory_copy(output + len - 8, ".xvm.exe", 8);
    output[len] = '\0';
    return output;
  }
  char *output = allocate(len + 9);
  memory_copy(output, input, len);
  memory_copy(output + len, ".xvm.exe", 8);
  output[len + 8] = '\0';
  return output;
}

static void handle_assemble_xvm(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  const char *output = cli_option_get(ctx, "--output");
  bool profile = cli_option_has(ctx, "--profile");
  mod_t *mod = xvm_asm_load_mod(make_path(pathname), profile);
  xvm_exe_t *exe = make_xvm_exe();
  xvm_exe_from_mod(exe, mod);
  mod_free(mod);
  if (output) {
    xvm_exe_dump(exe, output);
  } else {
    char *default_output = build_output_pathname(pathname);
    xvm_exe_dump(exe, default_output);
    free(default_output);
  }
  xvm_exe_free(exe);
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
    who_printf("  use --entry or add (default-entry ...) to xvm asm source\n");
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

  cli_define_route(router, "assemble file.xvm.asm --output --profile");
  cli_define_route(router, "run file.xvm.exe --entry");
  cli_define_route(router, "test file.xvm.exe --profile --snapshot --builtin");

  cli_define_handler(router, "assemble", handle_assemble_xvm);
  cli_define_handler(router, "run", handle_run_xvm);
  cli_define_handler(router, "test", handle_test_xvm);

  cli_router_run(router, argc, argv);
  cli_router_free(router);
  return 0;
}
