#include "index.h"

static stack_t *stack = NULL;

void
stdout_push(const char *filename) {
    if (!stack) {
        stack = make_stack();
    }

    fflush(stdout);
    stack_push(stack, (void *) (int64_t) dup(1));
    int fd = open(filename, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    assert(fd != -1);
    int ok = dup2(fd, 1);
    assert(ok != -1);
    close(fd);
    setbuf(stdout, NULL);
}

void
stdout_drop(void) {
    fflush(stdout);
    int fd = (int) (int64_t) stack_pop(stack);
    int ok = dup2(fd, 1);
    assert(ok != -1);
    close(fd);
}
