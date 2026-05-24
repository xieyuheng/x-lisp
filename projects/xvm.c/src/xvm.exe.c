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

static void handle_assemble(cmd_ctx_t *ctx) {
  const char *pathname = cmd_get_arg(ctx, 0);
  const char *output = cmd_get_option(ctx, "--output");
  bool profile = cmd_has_option(ctx, "--profile");
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

static void handle_run(cmd_ctx_t *ctx) {
  const char *pathname = cmd_get_arg(ctx, 0);
  xexe_t *xexe = make_xexe();
  xexe_load(xexe, pathname);
  mod_t *mod = xexe_to_mod(xexe);
  xexe_free(xexe);

  const char *entry = cmd_get_option(ctx, "--entry");
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

static void handle_test(cmd_ctx_t *ctx) {
  const char *pathname = cmd_get_arg(ctx, 0);
  const char *snapshot = cmd_get_option(ctx, "--snapshot");
  bool profile = cmd_has_option(ctx, "--profile");
  bool builtin = cmd_has_option(ctx, "--builtin");
  xexe_t *xexe = make_xexe();
  xexe_load(xexe, pathname);
  mod_t *mod = xexe_to_mod(xexe);
  xexe_free(xexe);
  if (builtin) mod_builtin_test(mod, snapshot, profile);
  mod_test(mod, snapshot, profile);
}

int main(int argc, char *argv[]) {
  sanity_check();
  setbuf(stdout, NULL);
  setbuf(stderr, NULL);
  init_global_gc();

  cmd_router_t *router = cmd_make_router("xvm", "0.1.0");

  cmd_define_route(router, "assemble file.xasm --output --profile");
  cmd_define_route(router, "run file.xexe --entry");
  cmd_define_route(router, "test file.xexe --profile --snapshot --builtin");

  cmd_define_handler(router, "assemble", handle_assemble);
  cmd_define_handler(router, "run", handle_run);
  cmd_define_handler(router, "test", handle_test);

  cmd_router_run(router, argc, argv);
  cmd_router_free(router);
  return 0;
}
