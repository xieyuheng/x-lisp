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
  mod_t *mod = xasm_load(make_path(pathname), profile);
  xexe_t *xexe = make_xexe();
  xexe_assemble(xexe, mod);
  mod_free(mod);
  if (output) {
    xexe_write(xexe, output);
  } else {
    char *default_output = build_output_pathname(pathname);
    xexe_write(xexe, default_output);
    free(default_output);
  }
  xexe_free(xexe);
}

static void handle_call(cmd_ctx_t *ctx){
  const char *pathname = cmd_get_arg(ctx, 0);
  const char *name = cmd_get_arg(ctx, 1);
  bool profile = cmd_has_option(ctx, "--profile");
  xexe_t *xexe = make_xexe();
  xexe_load(xexe, pathname);
  mod_t *mod = xexe_to_mod(xexe, profile);
  xexe_free(xexe);
  array_t *args = make_array();
  for (size_t i = 2; i < cmd_count_args(ctx); i ++) {
    value_t arg = x_object(make_xstring(cmd_get_arg(ctx, i)));
    array_push(args, (void *) arg);
  }

  xasm_call(mod, name, args);
}

static void handle_test(cmd_ctx_t *ctx) {
  const char *pathname = cmd_get_arg(ctx, 0);
  const char *snapshot = cmd_get_option(ctx, "--snapshot");
  bool profile = cmd_has_option(ctx, "--profile");
  bool builtin = cmd_has_option(ctx, "--builtin");
  xexe_t *xexe = make_xexe();
  xexe_load(xexe, pathname);
  mod_t *mod = xexe_to_mod(xexe, profile);
  xexe_free(xexe);
  if (builtin) xasm_builtin_test(mod, snapshot, profile);
  xasm_test(mod, snapshot, profile);
}

int main(int argc, char *argv[]) {
  sanity_check();
  setbuf(stdout, NULL);
  setbuf(stderr, NULL);
  init_global_gc();

  cmd_router_t *router = cmd_make_router("xvm", "0.1.0");

  cmd_define_route(router, "assemble file --output --profile");
  cmd_define_route(router, "call file function --profile");
  cmd_define_route(router, "test file --profile --snapshot --builtin");

  cmd_define_handler(router, "assemble", handle_assemble);
  cmd_define_handler(router, "call", handle_call);
  cmd_define_handler(router, "test", handle_test);

  cmd_router_run(router, argc, argv);
  cmd_router_free(router);
  return 0;
}
