#include "index.h"

#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

char *os_getcwd(void) {
  size_t size = 256;
  for (;;) {
    char *buffer = malloc(size);
    if (!buffer) return NULL;

    if (getcwd(buffer, size)) return buffer;

    free(buffer);
    if (errno != ERANGE) return NULL;
    size *= 2;
  }
}

FILE *os_fopen(const char *pathname, const char *mode) {
  return fopen(pathname, mode);
}

int os_file_descriptor(FILE *file) {
  return fileno(file);
}

int64_t os_file_size(FILE *file) {
  struct stat st;
  if (fstat(fileno(file), &st) != 0) return -1;
  return (int64_t) st.st_size;
}

bool os_file_sync(FILE *file) {
  return fsync(fileno(file)) == 0;
}

void os_file_lock(FILE *file) {
  flockfile(file);
}

void os_file_unlock(FILE *file) {
  funlockfile(file);
}

int os_open_output_truncate(const char *pathname) {
  return open(pathname, O_WRONLY | O_CREAT | O_TRUNC, 0644);
}

int os_dup(int fd) {
  return dup(fd);
}

int os_dup2(int old_fd, int new_fd) {
  return dup2(old_fd, new_fd);
}

int os_close(int fd) {
  return close(fd);
}

bool os_path_exists(const char *pathname) {
  return access(pathname, F_OK) != -1;
}

bool os_path_is_file(const char *pathname) {
  if (!os_path_exists(pathname)) return false;

  struct stat st;
  if (stat(pathname, &st) == -1) return false;
  return S_ISREG(st.st_mode);
}

bool os_path_is_directory(const char *pathname) {
  if (!os_path_exists(pathname)) return false;

  struct stat st;
  if (stat(pathname, &st) == -1) return false;
  return S_ISDIR(st.st_mode);
}

bool os_make_directory(const char *pathname) {
  return mkdir(pathname, 0777) == 0;
}

bool os_delete_file(const char *pathname) {
  return unlink(pathname) == 0;
}

bool os_delete_directory(const char *pathname) {
  return rmdir(pathname) == 0;
}

bool os_delete(const char *pathname) {
  return remove(pathname) == 0;
}

bool os_rename(const char *old_pathname, const char *new_pathname) {
  return rename(old_pathname, new_pathname) == 0;
}

struct os_dir_t {
  DIR *dir;
};

os_dir_t *os_dir_open(const char *pathname) {
  DIR *dir = opendir(pathname);
  if (!dir) return NULL;

  os_dir_t *self = malloc(sizeof(os_dir_t));
  if (!self) {
    closedir(dir);
    return NULL;
  }

  self->dir = dir;
  return self;
}

char *os_dir_next(os_dir_t *self) {
  struct dirent *entry = readdir(self->dir);
  if (!entry) return NULL;

  size_t length = strlen(entry->d_name);
  char *name = malloc(length + 1);
  if (!name) return NULL;

  memcpy(name, entry->d_name, length + 1);
  return name;
}

void os_dir_close(os_dir_t *self) {
  if (!self) return;
  if (self->dir) closedir(self->dir);
  free(self);
}

size_t os_page_size(void) {
  long page_size = sysconf(_SC_PAGE_SIZE);
  if (page_size <= 0) return 4096;
  return (size_t) page_size;
}

void *os_allocate_page_aligned(size_t size) {
  if (size == 0) size = 1;

  void *pointer = NULL;
  if (posix_memalign(&pointer, os_page_size(), size) != 0) return NULL;
  return pointer;
}

void os_free_page_aligned(void *pointer) {
  free(pointer);
}

uint64_t os_monotonic_nanoseconds(void) {
  struct timespec ts;
  clock_gettime(CLOCK_MONOTONIC, &ts);
  return (uint64_t) ts.tv_sec * 1000000000ULL + (uint64_t) ts.tv_nsec;
}

void os_sleep_nanoseconds(uint64_t nanoseconds) {
  struct timespec ts = {
    .tv_sec = (time_t) (nanoseconds / 1000000000ULL),
    .tv_nsec = (long) (nanoseconds % 1000000000ULL),
  };
  nanosleep(&ts, NULL);
}
