#include "index.h"

static void sanity_check(void) {
  assert(sizeof(uint64_t) == sizeof(void *));
  assert(sizeof(uint64_t) == sizeof(size_t));
}

static void handle_run_x86_exe(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  x86_exe_t *exe = make_x86_exe(buffer);
  x86_exe_check(exe);
  x86_exe_load(exe);
  x86_exe_call_entry(exe);
  x86_exe_free(exe);
}

static void handle_run_x86_exe_and_print(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  x86_exe_t *exe = make_x86_exe(buffer);
  x86_exe_check(exe);
  x86_exe_load(exe);
  void *result = x86_exe_call_entry(exe);
  x86_exe_free(exe);
  printf("%ld\n", (int64_t) result);
}

static void handle_x86_info(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  x86_exe_t *exe = make_x86_exe(buffer);
  x86_exe_check(exe);

  x86_exe_header_t *h = exe->header;
  size_t label_count = h->label_table_size / sizeof(x86_exe_label_entry_t);
  size_t relocation_count = h->relocation_table_size / sizeof(x86_exe_relocation_entry_t);

  printf("Magic:      x86\n");
  printf("Version:    %lu\n", h->version);
  printf("Code:       %lu bytes at file offset %lu\n", h->code_size, h->code_file_offset);
  printf("Entry:      offset %lu in code segment\n", h->entry_code_segment_offset);
  printf("Data:       %lu bytes at file offset %lu\n", h->data_size, h->data_file_offset);
  printf("Space:      %lu bytes\n", h->space_size);
  printf("String table:     %lu bytes at file offset %lu\n", h->string_table_size, h->string_table_file_offset);
  printf("Label table:      %zu entries (%lu bytes) at file offset %lu\n", label_count, h->label_table_size, h->label_table_file_offset);
  printf("Relocation table: %zu entries (%lu bytes) at file offset %lu\n", relocation_count, h->relocation_table_size, h->relocation_table_file_offset);

  x86_exe_free(exe);
}

static void handle_x86_disasm(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  x86_exe_t *exe = make_x86_exe(buffer);
  x86_exe_check(exe);

  x86_exe_header_t *h = exe->header;
  uint8_t *file_start = buffer_raw_bytes(buffer);
  uint8_t *code = file_start + h->code_file_offset;

  FILE *pipe = popen("ndisasm -b 64 -", "w");
  if (!pipe) {
    where_printf("[x86-disasm] popen failed\n");
    exit(1);
  }
  fwrite(code, 1, h->code_size, pipe);
  pclose(pipe);

  x86_exe_free(exe);
}

static void handle_x86_xxd(cli_ctx_t *ctx) {
  const char *pathname = cli_arg_get(ctx, 0);
  file_t *file = open_file_or_fail(pathname, "rb");
  buffer_t *buffer = make_buffer();
  buffer_read(buffer, file);
  file_close(file);
  x86_exe_t *exe = make_x86_exe(buffer);
  x86_exe_check(exe);

  x86_exe_header_t *h = exe->header;
  uint8_t *file_start = buffer_raw_bytes(buffer);
  uint8_t *code = file_start + h->code_file_offset;

  FILE *pipe = popen("xxd", "w");
  if (!pipe) {
    where_printf("[x86-xxd] popen failed\n");
    exit(1);
  }
  fwrite(code, 1, h->code_size, pipe);
  pclose(pipe);

  x86_exe_free(exe);
}

int main(int argc, char *argv[]) {
  sanity_check();
  setbuf(stdout, NULL);
  setbuf(stderr, NULL);
  init_global_gc();

  setup_full_command_line((size_t) argc, argv);

  cli_router_t *router = cli_make_router("x86", "0.1.0");

  cli_define_route(router, "run file.x86.exe");
  cli_define_route(router, "run-and-print file.x86.exe");
  cli_define_route(router, "info file.x86.exe");
  cli_define_route(router, "disasm file.x86.exe");
  cli_define_route(router, "xxd file.x86.exe");

  cli_define_handler(router, "run", handle_run_x86_exe);
  cli_define_handler(router, "run-and-print", handle_run_x86_exe_and_print);
  cli_define_handler(router, "info", handle_x86_info);
  cli_define_handler(router, "disasm", handle_x86_disasm);
  cli_define_handler(router, "xxd", handle_x86_xxd);

  cli_router_run(router, argc, argv);
  cli_router_free(router);
  return 0;
}
