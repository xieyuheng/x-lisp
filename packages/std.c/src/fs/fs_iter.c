#include "index.h"

fs_iter_t *fs_make_iter(const char *pathname) {
  fs_iter_t *self = new(fs_iter_t);
  self->dir = os_dir_open(pathname);
  assert(self->dir != NULL);
  self->path = make_path(pathname);
  return self;
}

void fs_iter_free(fs_iter_t *self) {
  if (self->dir) os_dir_close(self->dir);
  path_free(self->path);
  free(self);
}

char *fs_iter_next(fs_iter_t *self) {
  if (!self->dir) return NULL;

  while (true) {
    char *name = os_dir_next(self->dir);
    if (!name) {
      os_dir_close(self->dir);
      self->dir = NULL;
      return NULL;
    }

    if (string_equal(name, ".") ||
        string_equal(name, "..")) {
      string_free(name);
      continue;
    }

    return name;
  }
}
