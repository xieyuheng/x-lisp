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

static int xvm_main(int argc, char *argv[]) {
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

#if defined(_WIN32)

// Windows passes argv as UTF-16; convert it to UTF-8 for the rest of the VM.
static char *xvm_utf16_to_utf8(const wchar_t *wide) {
  int size = WideCharToMultiByte(CP_UTF8, 0, wide, -1, NULL, 0, NULL, NULL);
  if (size == 0) return NULL;

  char *string = malloc((size_t) size);
  if (!string) return NULL;

  WideCharToMultiByte(CP_UTF8, 0, wide, -1, string, size, NULL, NULL);
  return string;
}

int wmain(int argc, wchar_t *wargv[]) {
  char **argv = calloc((size_t) argc + 1, sizeof(char *));
  if (!argv) return 1;

  for (int i = 0; i < argc; i++) {
    argv[i] = xvm_utf16_to_utf8(wargv[i]);
    if (!argv[i]) {
      for (int j = 0; j < i; j++) free(argv[j]);
      free(argv);
      return 1;
    }
  }

  int status = xvm_main(argc, argv);

  for (int i = 0; i < argc; i++) free(argv[i]);
  free(argv);
  return status;
}

#else

int main(int argc, char *argv[]) {
  return xvm_main(argc, argv);
}

#endif
