#include "index.h"

static void thread_entry(void *arg) {
  thread_t *thread = arg;
  thread->thread_fn(thread);
}

thread_t *thread_start(thread_fn_t *thread_fn, void *arg) {
  thread_t *self = new(thread_t);
  self->thread_fn = thread_fn;
  self->arg = arg;
  self->handle = os_thread_start(thread_entry, self);
  assert(self->handle);
  return self;
}

void thread_join(thread_t *self) {
  os_thread_join(self->handle);
  free(self);
}
