#pragma once

#include "types.h"
#include "../stack/index.h"

struct fs_recursive_iter_t {
  stack_t *stack;       // 目录栈，元素为 recursive_iter_frame_t *
  char *base_path;      // 起始目录（规范化，无末尾 /）
};

fs_recursive_iter_t *fs_make_recursive_iter(const char *pathname);
void fs_recursive_iter_free(fs_recursive_iter_t *self);

char *fs_recursive_iter_next(fs_recursive_iter_t *self);
