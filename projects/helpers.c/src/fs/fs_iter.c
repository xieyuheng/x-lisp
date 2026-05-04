#include "index.h"

fs_iter_t *fs_make_iter(const char *pathname) {
  fs_iter_t *self = new(fs_iter_t);
  self->dir = opendir(pathname);
  assert(self->dir != NULL);
  self->dir_path = make_path(pathname);
  return self;
}

void fs_iter_free(fs_iter_t *self) {
  if (self->dir) {
    closedir(self->dir);
  }
  if (self->dir_path) {
    path_free(self->dir_path);
  }
  free(self);
}

char *fs_iter_next(fs_iter_t *self) {
  if (!self->dir) {
    return NULL;
  }

  while (true) {
    struct dirent *entry = readdir(self->dir);
    if (!entry) {
      closedir(self->dir);
      self->dir = NULL;
      return NULL;
    }

    if (string_equal(entry->d_name, ".") || string_equal(entry->d_name, "..")) {
      continue;
    }

    return string_copy(entry->d_name);
  }
}
