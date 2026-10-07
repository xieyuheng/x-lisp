#include "index.h"

bool fs_exists(const char *pathname) {
  return os_path_exists(pathname);
}

bool fs_is_file(const char *pathname) {
  return os_path_is_file(pathname);
}

bool fs_is_directory(const char *pathname) {
  return os_path_is_directory(pathname);
}

char *fs_read(const char *pathname) {
  file_t *file = open_file_or_fail(pathname, "rb");
  char *string = (char *) file_read_bytes(file);
  file_close(file);
  return string;
}

void fs_write(const char *pathname, const char *string) {
  file_t *file = open_file_or_fail(pathname, "wb");
  file_write_string(file, string);
  file_close(file);
}

static void fs_make_directory(const char *pathname) {
  if (fs_exists(pathname)) {
    assert(fs_is_directory(pathname));
    return;
  } else {
    assert(os_make_directory(pathname));
  }
}

static void fs_ensure_directory_recur(path_t *path) {
  if (path_segment_length(path) == 0) {
    return;
  }

  if (path_segment_length(path) == 1) {
    fs_make_directory(path_raw_string(path));
    return;
  }

  char *segment = path_pop_segment(path);
  fs_ensure_directory_recur(path);
  path_push_segment(path, segment);
  fs_make_directory(path_raw_string(path));
}

void fs_ensure_directory(const char *pathname) {
  path_t *path = make_path(pathname);
  fs_ensure_directory_recur(path);
  path_free(path);
}

void fs_ensure_file(const char *pathname) {
  path_t *path = make_path(pathname);
  assert(path_segment_length(path) > 0);
  char *segment = path_pop_segment(path);
  fs_ensure_directory_recur(path);
  path_push_segment(path, segment);
  fs_write(path_raw_string(path), "");
  path_free(path);
}

void fs_delete_file(const char *pathname) {
  if (fs_exists(pathname)) {
    assert(fs_is_file(pathname));
    assert(os_delete_file(pathname));
  }
}

void fs_delete_directory(const char *pathname) {
  if (fs_exists(pathname)) {
    assert(fs_is_directory(pathname));
    assert(os_delete_directory(pathname));
  }
}

void fs_delete(const char *pathname) {
  if (fs_exists(pathname)) {
    assert(os_delete(pathname));
  }
}

void fs_rename(const char *old_pathname, const char *new_pathname) {
  assert(os_rename(old_pathname, new_pathname));
}
