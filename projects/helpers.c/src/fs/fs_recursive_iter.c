#include "index.h"
#include "../stack/index.h"

typedef struct {
  path_t *dir_path;   // 当前目录的完整路径
  fs_iter_t *iter;     // 当前目录的迭代器
} recursive_iter_frame_t;

static void free_frame(void *ptr) {
  recursive_iter_frame_t *frame = ptr;
  path_free(frame->dir_path);
  fs_iter_free(frame->iter);
  free(frame);
}

static recursive_iter_frame_t *make_frame(const char *pathname) {
  recursive_iter_frame_t *frame = new(recursive_iter_frame_t);
  frame->dir_path = make_path(pathname);
  frame->iter = fs_make_iter(pathname);
  return frame;
}

fs_recursive_iter_t *fs_make_recursive_iter(const char *pathname) {
  fs_recursive_iter_t *self = new(fs_recursive_iter_t);
  self->stack = make_stack_with(free_frame);

  // 规范化 base_path，去掉末尾的 /
  path_t *base = make_path(pathname);
  self->base_path = string_copy(path_raw_string(base));
  path_free(base);

  stack_push(self->stack, make_frame(pathname));
  return self;
}

void fs_recursive_iter_free(fs_recursive_iter_t *self) {
  if (self->stack) {
    stack_free(self->stack);
  }
  if (self->base_path) {
    string_free(self->base_path);
  }
  free(self);
}

char *fs_recursive_iter_next(fs_recursive_iter_t *self) {
  while (!stack_is_empty(self->stack)) {
    recursive_iter_frame_t *frame = stack_top(self->stack);

    char *name = fs_iter_next(frame->iter);
    if (!name) {
      stack_pop(self->stack);
      continue;
    }

    // 构造完整路径
    path_t *full_path = path_copy(frame->dir_path);
    path_join(full_path, name);
    const char *full_path_str = path_raw_string(full_path);

    // 如果是目录，压入栈以便后续遍历
    bool is_dir = fs_is_directory(full_path_str);
    if (is_dir) {
      stack_push(self->stack, make_frame(full_path_str));
    }

    // 计算相对路径
    const char *base = self->base_path;
    size_t base_len = string_length(base);
    char *relative = NULL;

    if (string_starts_with(full_path_str, base)) {
      size_t start = base_len;
      if (full_path_str[start] == '/') {
        start++;
      }
      relative = string_substring(full_path_str, start, string_length(full_path_str));
    } else {
      relative = string_copy(full_path_str);
    }

    path_free(full_path);
    string_free(name);
    return relative;
  }

  return NULL;
}
