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


static void handle_run_x86_flat(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  x86_execute_flat(buffer);
  buffer_free(buffer);
}

static void handle_run_x86_flat_and_print(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  void *result = x86_execute_flat(buffer);
  buffer_free(buffer);
  printf("%ld\n", (int64_t) result);
}

static void handle_run_x86_exe(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  x86_execute_exe(buffer);
  buffer_free(buffer);
}

static void handle_run_x86_exe_and_print(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  void *result = x86_execute_exe(buffer);
  buffer_free(buffer);
  printf("%ld\n", (int64_t) result);
}

static void handle_run_x86_native(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  const char *entry_name = cli_option_get(ctx, "--entry");

  mod_t *mod = make_mod();
  import_builtin(mod);
  mod_setup(mod);

  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);

  xvm_t *xvm = make_xvm(mod);
  x86_image_t *image = x86_load_image(xvm, buffer);
  if (!image) exit(1);

  if (entry_name) {
    x86_call_native_entry(image, entry_name, 0, NULL);
  } else {
    x86_call_entry(image);
  }

  x86_unload_image(image, xvm);
  xvm_free(xvm);
  buffer_free(buffer);
  mod_free(mod);
}

static void handle_test_x86(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  const char *snapshot = cli_option_get(ctx, "--snapshot");
  bool profile = cli_option_has(ctx, "--profile");

  mod_t *mod = make_mod();
  import_builtin(mod);
  mod_setup(mod);

  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);

  xvm_t *xvm = make_xvm(mod);
  x86_image_t *image = x86_load_image(xvm, buffer);
  if (!image) exit(1);

  array_t *tests = x86_collect_tests(image);
  const size_t testCount = array_length(tests);

  x86_call_entry(image);

  for (size_t i = 0; i < testCount; i++) {
    const char *name = (const char *) array_get(tests, i);
    double test_start = time_millisecond();

    if (snapshot == NULL) {
      x86_call_native_entry(image, name, 0, NULL);
    } else {
      path_t *path = make_path(snapshot);
      path_join(path, name);
      path_join_extension(path, ".out");
      char *segment = path_pop_segment(path);
      fs_ensure_directory(path_raw_string(path));
      path_push_segment(path, segment);

      stdout_push(path_raw_string(path));
      x86_call_native_entry(image, name, 0, NULL);
      stdout_drop();

      char *output = fs_read(path_raw_string(path));
      if (string_is_empty(output)) {
        fs_delete_file(path_raw_string(path));
      }
      string_free(output);
      path_free(path);
    }

    printf("[test] %s", name);
    if (profile) {
      double elapsed = time_millisecond_passed(test_start);
      printf(" -- %.3fms", elapsed);
    }
    printf("\n");
  }

  array_free(tests);
  x86_unload_image(image, xvm);
  xvm_free(xvm);
  buffer_free(buffer);
  mod_free(mod);
}

int main(int argc, char *argv[]) {
  sanity_check();
  setbuf(stdout, NULL);
  setbuf(stderr, NULL);
  init_global_gc();

  setup_full_command_line((size_t) argc, argv);

  cli_router_t *router = cli_make_router("meta", "0.1.0");

  cli_define_route(router, "assemble-xvm file.xvm.asm --output --profile");
  cli_define_route(router, "run-xvm file.xvm.exe --entry");
  cli_define_route(router, "test-xvm file.xvm.exe --profile --snapshot --builtin");
  cli_define_route(router, "run-x86-flat file.x86.flat");
  cli_define_route(router, "run-x86-flat-and-print file.x86.flat");
  cli_define_route(router, "run-x86-exe file.x86.exe");
  cli_define_route(router, "run-x86-exe-and-print file.x86.exe");
  cli_define_route(router, "run-x86 file.x86.exe --entry");
  cli_define_route(router, "test-x86 file.x86.exe --profile --snapshot");

  cli_define_handler(router, "assemble-xvm", handle_assemble_xvm);
  cli_define_handler(router, "run-xvm", handle_run_xvm);
  cli_define_handler(router, "test-xvm", handle_test_xvm);
  cli_define_handler(router, "run-x86-flat", handle_run_x86_flat);
  cli_define_handler(router, "run-x86-flat-and-print", handle_run_x86_flat_and_print);
  cli_define_handler(router, "run-x86-exe", handle_run_x86_exe);
  cli_define_handler(router, "run-x86-exe-and-print", handle_run_x86_exe_and_print);
  cli_define_handler(router, "run-x86", handle_run_x86_native);
  cli_define_handler(router, "test-x86", handle_test_x86);

  cli_router_run(router, argc, argv);
  cli_router_free(router);
  return 0;
}
