#include "index.h"

static void sanity_check(void) {
  assert(sizeof(uint64_t) == sizeof(void *));
  assert(sizeof(uint64_t) == sizeof(size_t));
}

static void handle_run(cmd_ctx_t *ctx) {
  char *pathname = cmd_get_arg(ctx, 0);
  mod_t *mod = li_load(make_path(pathname));
  (void) mod;
}

static void handle_run_fn(cmd_ctx_t *ctx){
  char *name = cmd_get_arg(ctx, 0);
  char *pathname = cmd_get_arg(ctx, 1);
  mod_t *mod = li_load(make_path(pathname));
  li_call(mod, name);
}

static void handle_test(cmd_ctx_t *ctx) {
  char *pathname = cmd_get_arg(ctx, 0);
  char *snapshot = cmd_get_option(ctx, "--snapshot");
  mod_t *mod = li_load(make_path(pathname));
  if (cmd_has_option(ctx, "--builtin")) li_builtin_test(mod, snapshot);
  li_test(mod, snapshot);
}

static void init(void) {
  init_global_gc();
}

int main(int argc, char *argv[]) {
  sanity_check();

  init();

  cmd_router_t *router = cmd_make_router("li", "0.1.0");

  cmd_define_route(router, "run file");
  cmd_define_route(router, "call function file");
  cmd_define_route(router, "test file --snapshot --builtin");

  cmd_define_handler(router, "run", handle_run);
  cmd_define_handler(router, "call", handle_run_fn);
  cmd_define_handler(router, "test", handle_test);

  cmd_router_run(router, argc, argv);
  cmd_router_free(router);
  return 0;
}
