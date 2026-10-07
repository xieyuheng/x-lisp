#include "index.h"

static stack_t *stack = NULL;

void stdout_push(const char *filename) {
  if (!stack) {
    stack = make_stack();
  }

  fflush(stdout);
  stack_push(stack, (void *) (int64_t) os_dup(1));
  int fd = os_open_output_truncate(filename);
  assert(fd != -1);
  int ok = os_dup2(fd, 1);
  assert(ok != -1);
  os_close(fd);
  setbuf(stdout, NULL);
}

void stdout_drop(void) {
  fflush(stdout);
  int fd = (int) (int64_t) stack_pop(stack);
  int ok = os_dup2(fd, 1);
  assert(ok != -1);
  os_close(fd);
}
