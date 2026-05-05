#include "index.h"

static void sanity_check(void) {
  assert(sizeof(uint64_t) == sizeof(void *));
  assert(sizeof(uint64_t) == sizeof(size_t));
}

static void handle_call(cmd_ctx_t *ctx){
  const char *pathname = cmd_get_arg(ctx, 0);
  const char *name = cmd_get_arg(ctx, 1);
  bool profile = cmd_has_option(ctx, "--profile");
  mod_t *mod = stk_load(make_path(pathname), profile);
  array_t *args = make_array();
  for (size_t i = 2; i < cmd_count_args(ctx); i ++) {
    value_t arg = x_object(make_xstring(cmd_get_arg(ctx, i)));
    array_push(args, (void *) arg);
  }

  stk_call(mod, name, args);
}

static void handle_test(cmd_ctx_t *ctx) {
  const char *pathname = cmd_get_arg(ctx, 0);
  const char *snapshot = cmd_get_option(ctx, "--snapshot");
  bool profile = cmd_has_option(ctx, "--profile");
  bool builtin = cmd_has_option(ctx, "--builtin");
  mod_t *mod = stk_load(make_path(pathname), profile);
  if (builtin) stk_builtin_test(mod, snapshot, profile);
  stk_test(mod, snapshot, profile);
}

int main(int argc, char *argv[]) {
  sanity_check();
  init_global_gc();

  cmd_router_t *router = cmd_make_router("stack-lisp", "0.1.0");

  cmd_define_route(router, "call file function --profile");
  cmd_define_route(router, "test file --profile --snapshot --builtin");

  cmd_define_handler(router, "call", handle_call);
  cmd_define_handler(router, "test", handle_test);

  cmd_router_run(router, argc, argv);
  cmd_router_free(router);
  return 0;
}
