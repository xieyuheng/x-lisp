#include "index.h"
#include "../stack/index.h"

fs_recursive_iter_t *fs_make_recursive_iter(const char *pathname) {
  fs_recursive_iter_t *self = new(fs_recursive_iter_t);
  self->stack = make_stack_with((free_fn_t *) fs_iter_free);
  self->path = make_path(pathname);
  stack_push(self->stack, fs_make_iter(pathname));
  return self;
}

void fs_recursive_iter_free(fs_recursive_iter_t *self) {
  stack_free(self->stack);
  path_free(self->path);
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

    path_t *full_path = path_copy(iter->path);
    path_join(full_path, name);
    string_free(name);
    if (fs_is_directory(path_raw_string(full_path))) {
      stack_push(self->stack, fs_make_iter(path_raw_string(full_path)));
    }

    path_t *relative_path = path_relative(self->path, full_path);
    path_free(full_path);
    return path_into_string(relative_path);
  }

  return NULL;
}
