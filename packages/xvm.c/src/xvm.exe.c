#include "index.h"

static void sanity_check(void) {
  assert(sizeof(uint64_t) == sizeof(void *));
  assert(sizeof(uint64_t) == sizeof(size_t));
}

static char *build_output_pathname(const char *input) {
  size_t len = string_length(input);
  if (len > 5 && string_equal(input + len - 5, ".xasm")) {
    char *output = allocate(len + 1);
    memory_copy(output, input, len - 5);
    memory_copy(output + len - 5, ".xexe", 5);
    output[len] = '\0';
    return output;
  }
  char *output = allocate(len + 6);
  memory_copy(output, input, len);
  memory_copy(output + len, ".xexe", 5);
  output[len + 5] = '\0';
  return output;
}

static void handle_assemble(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  const char *output = cli_option_get(ctx, "--output");
  bool profile = cli_option_has(ctx, "--profile");
  mod_t *mod = xasm_load_mod(make_path(pathname), profile);
  xexe_t *xexe = make_xexe();
  xexe_from_mod(xexe, mod);
  mod_free(mod);
  if (output) {
    xexe_dump(xexe, output);
  } else {
    char *default_output = build_output_pathname(pathname);
    xexe_dump(xexe, default_output);
    free(default_output);
  }
  xexe_free(xexe);
}

static void handle_run(cli_ctx_t *ctx) {
  setup_current_command_line(ctx->passthrough);

  const char *pathname = cli_arg_get(ctx, 0);
  xexe_t *xexe = make_xexe();
  xexe_load(xexe, pathname);
  mod_t *mod = xexe_to_mod(xexe);
  xexe_free(xexe);

  const char *entry = cli_option_get(ctx, "--entry");
  if (!entry) {
    entry = mod->entry_name;
  }

  if (!entry) {
    who_printf("no entry function specified\n");
    who_printf("  use --entry or add (default-entry ...) to xasm source\n");
    exit(1);
  }

  mod_call_entry(mod, entry);
}

static void handle_test(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  const char *snapshot = cli_option_get(ctx, "--snapshot");
  bool profile = cli_option_has(ctx, "--profile");
  bool builtin = cli_option_has(ctx, "--builtin");
  xexe_t *xexe = make_xexe();
  xexe_load(xexe, pathname);
  mod_t *mod = xexe_to_mod(xexe);
  xexe_free(xexe);
  mod_test(mod, snapshot, profile, builtin);
}

static void handle_run_xasm(cli_ctx_t *ctx) {
  setup_current_command_line(ctx->passthrough);

  const char *pathname = cli_arg_get(ctx, 0);
  const char *entry = cli_option_get(ctx, "--entry");
  bool profile = cli_option_has(ctx, "--profile");
  mod_t *mod = xasm_load_mod(make_path(pathname), profile);

  if (!entry) {
    entry = mod->entry_name;
  }

  if (!entry) {
    who_printf("no entry function specified\n");
    who_printf("  use --entry or add (default-entry ...) to xasm source\n");
    exit(1);
  }

  mod_call_entry(mod, entry);
  mod_free(mod);
}

static void handle_test_xasm(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  const char *snapshot = cli_option_get(ctx, "--snapshot");
  bool profile = cli_option_has(ctx, "--profile");
  bool builtin = cli_option_has(ctx, "--builtin");
  mod_t *mod = xasm_load_mod(make_path(pathname), profile);
  mod_test(mod, snapshot, profile, builtin);
  mod_free(mod);
}


static void handle_run_x86(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  x86_execute(buffer);
  buffer_free(buffer);
}

int main(int argc, char *argv[]) {
  sanity_check();
  setbuf(stdout, NULL);
  setbuf(stderr, NULL);
  init_global_gc();

  setup_full_command_line((size_t) argc, argv);

  cli_router_t *router = cli_make_router("xvm", "0.1.0");

  cli_define_route(router, "assemble file.xasm --output --profile");
  cli_define_route(router, "run file.xexe --entry");
  cli_define_route(router, "test file.xexe --profile --snapshot --builtin");
  cli_define_route(router, "run-xasm file.xasm --entry --profile");
  cli_define_route(router, "test-xasm file.xasm --profile --snapshot --builtin");
  cli_define_route(router, "run-x86 file.x86");

  cli_define_handler(router, "assemble", handle_assemble);
  cli_define_handler(router, "run", handle_run);
  cli_define_handler(router, "test", handle_test);
  cli_define_handler(router, "run-xasm", handle_run_xasm);
  cli_define_handler(router, "test-xasm", handle_test_xasm);
  cli_define_handler(router, "run-x86", handle_run_x86);

  cli_router_run(router, argc, argv);
  cli_router_free(router);
  return 0;
}
