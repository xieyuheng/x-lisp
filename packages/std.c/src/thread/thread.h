#pragma once

struct thread_t {
  os_thread_handle_t handle;
  thread_fn_t *thread_fn;
  void *arg;
  thread_pool_t *thread_pool;
  size_t id;
};

thread_t *thread_start(thread_fn_t *thread_fn, void *arg);
void thread_join(thread_t *self);
