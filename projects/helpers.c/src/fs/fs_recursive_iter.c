#include "index.h"
#include "../stack/index.h"

static void free_iter(void *ptr) {
  fs_iter_free(ptr);
}

fs_recursive_iter_t *fs_make_recursive_iter(const char *pathname) {
  fs_recursive_iter_t *self = new(fs_recursive_iter_t);
  self->stack = make_stack_with(free_iter);
  self->base_path = make_path(pathname);
  stack_push(self->stack, fs_make_iter(pathname));
  return self;
}

void fs_recursive_iter_free(fs_recursive_iter_t *self) {
  if (self->stack) {
    stack_free(self->stack);
  }
  if (self->base_path) {
    path_free(self->base_path);
  }
  free(self);
}

char *fs_recursive_iter_next(fs_recursive_iter_t *self) {
  while (!stack_is_empty(self->stack)) {
    fs_iter_t *iter = stack_top(self->stack);

    char *name = fs_iter_next(iter);
    if (!name) {
      stack_pop(self->stack);
      continue;
    }

    path_t *full_path = path_copy(iter->dir_path);
    path_join(full_path, name);

    if (fs_is_directory(path_raw_string(full_path))) {
      stack_push(self->stack, fs_make_iter(path_raw_string(full_path)));
    }

    path_t *relative_path = path_relative(self->base_path, full_path);
    char *relative = string_copy(path_raw_string(relative_path));

    path_free(relative_path);
    path_free(full_path);
    string_free(name);
    return relative;
  }

  return NULL;
}
