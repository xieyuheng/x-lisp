#pragma once

#include "types.h"
#include "../path/index.h"

struct fs_iter_t {
  DIR *dir;
  path_t *dir_path;
};

fs_iter_t *fs_make_iter(const char *pathname);
void fs_iter_free(fs_iter_t *self);

char *fs_iter_next(fs_iter_t *self);
