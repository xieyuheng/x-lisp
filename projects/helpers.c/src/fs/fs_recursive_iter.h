#pragma once

#include "types.h"
#include "../stack/index.h"
#include "../path/index.h"

struct fs_recursive_iter_t {
  stack_t *stack;
  path_t *base_path;
};

fs_recursive_iter_t *fs_make_recursive_iter(const char *pathname);
void fs_recursive_iter_free(fs_recursive_iter_t *self);

char *fs_recursive_iter_next(fs_recursive_iter_t *self);
