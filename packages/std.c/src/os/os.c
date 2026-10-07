#include "index.h"

#if defined(_WIN32)

#include <direct.h>
#include <fcntl.h>
#include <io.h>
#include <sys/stat.h>

static wchar_t *os_utf8_to_utf16(const char *string) {
  if (!string) return NULL;

  int size = MultiByteToWideChar(CP_UTF8, MB_ERR_INVALID_CHARS, string, -1, NULL, 0);
  if (size == 0) {
    size = MultiByteToWideChar(CP_ACP, 0, string, -1, NULL, 0);
    if (size == 0) return NULL;

    wchar_t *wide = malloc((size_t) size * sizeof(wchar_t));
    if (!wide) return NULL;

    MultiByteToWideChar(CP_ACP, 0, string, -1, wide, size);
    return wide;
  }

  wchar_t *wide = malloc((size_t) size * sizeof(wchar_t));
  if (!wide) return NULL;

  MultiByteToWideChar(CP_UTF8, MB_ERR_INVALID_CHARS, string, -1, wide, size);
  return wide;
}

static char *os_utf16_to_utf8(const wchar_t *wide) {
  if (!wide) return NULL;

  int size = WideCharToMultiByte(CP_UTF8, 0, wide, -1, NULL, 0, NULL, NULL);
  if (size == 0) return NULL;

  char *string = malloc((size_t) size);
  if (!string) return NULL;

  WideCharToMultiByte(CP_UTF8, 0, wide, -1, string, size, NULL, NULL);
  return string;
}

char *os_getcwd(void) {
  DWORD size = GetCurrentDirectoryW(0, NULL);
  if (size == 0) return NULL;

  wchar_t *buffer = malloc((size_t) size * sizeof(wchar_t));
  if (!buffer) return NULL;

  DWORD written = GetCurrentDirectoryW(size, buffer);
  if (written == 0 || written >= size) {
    free(buffer);
    return NULL;
  }

  char *result = os_utf16_to_utf8(buffer);
  free(buffer);
  return result;
}

FILE *os_fopen(const char *pathname, const char *mode) {
  wchar_t *wide_pathname = os_utf8_to_utf16(pathname);
  wchar_t *wide_mode = os_utf8_to_utf16(mode);
  if (!wide_pathname || !wide_mode) {
    free(wide_pathname);
    free(wide_mode);
    return NULL;
  }

  FILE *file = _wfopen(wide_pathname, wide_mode);
  free(wide_pathname);
  free(wide_mode);
  return file;
}

int os_file_descriptor(FILE *file) {
  return _fileno(file);
}

int64_t os_file_size(FILE *file) {
  struct _stat64 st;
  if (_fstat64(_fileno(file), &st) != 0) return -1;
  return (int64_t) st.st_size;
}

bool os_file_sync(FILE *file) {
  return _commit(_fileno(file)) == 0;
}

void os_file_lock(FILE *file) {
  _lock_file(file);
}

void os_file_unlock(FILE *file) {
  _unlock_file(file);
}

int os_open_output_truncate(const char *pathname) {
  wchar_t *wide_pathname = os_utf8_to_utf16(pathname);
  if (!wide_pathname) return -1;

  int fd = _wopen(
    wide_pathname,
    _O_WRONLY | _O_CREAT | _O_TRUNC | _O_BINARY,
    _S_IREAD | _S_IWRITE);

  free(wide_pathname);
  return fd;
}

int os_dup(int fd) {
  return _dup(fd);
}

int os_dup2(int old_fd, int new_fd) {
  return _dup2(old_fd, new_fd);
}

int os_close(int fd) {
  return _close(fd);
}

bool os_path_exists(const char *pathname) {
  wchar_t *wide_pathname = os_utf8_to_utf16(pathname);
  if (!wide_pathname) return false;
  DWORD attributes = GetFileAttributesW(wide_pathname);
  free(wide_pathname);
  return attributes != INVALID_FILE_ATTRIBUTES;
}

bool os_path_is_file(const char *pathname) {
  wchar_t *wide_pathname = os_utf8_to_utf16(pathname);
  if (!wide_pathname) return false;

  DWORD attributes = GetFileAttributesW(wide_pathname);
  free(wide_pathname);

  if (attributes == INVALID_FILE_ATTRIBUTES) return false;
  return (attributes & FILE_ATTRIBUTE_DIRECTORY) == 0;
}

bool os_path_is_directory(const char *pathname) {
  wchar_t *wide_pathname = os_utf8_to_utf16(pathname);
  if (!wide_pathname) return false;

  DWORD attributes = GetFileAttributesW(wide_pathname);
  free(wide_pathname);

  if (attributes == INVALID_FILE_ATTRIBUTES) return false;
  return (attributes & FILE_ATTRIBUTE_DIRECTORY) != 0;
}

bool os_make_directory(const char *pathname) {
  wchar_t *wide_pathname = os_utf8_to_utf16(pathname);
  if (!wide_pathname) return false;

  BOOL ok = CreateDirectoryW(wide_pathname, NULL);
  free(wide_pathname);
  return ok != 0;
}

bool os_delete_file(const char *pathname) {
  wchar_t *wide_pathname = os_utf8_to_utf16(pathname);
  if (!wide_pathname) return false;

  BOOL ok = DeleteFileW(wide_pathname);
  free(wide_pathname);
  return ok != 0;
}

bool os_delete_directory(const char *pathname) {
  wchar_t *wide_pathname = os_utf8_to_utf16(pathname);
  if (!wide_pathname) return false;

  BOOL ok = RemoveDirectoryW(wide_pathname);
  free(wide_pathname);
  return ok != 0;
}

bool os_delete(const char *pathname) {
  if (os_delete_file(pathname)) return true;
  return os_delete_directory(pathname);
}

bool os_rename(const char *old_pathname, const char *new_pathname) {
  wchar_t *wide_old_pathname = os_utf8_to_utf16(old_pathname);
  wchar_t *wide_new_pathname = os_utf8_to_utf16(new_pathname);
  if (!wide_old_pathname || !wide_new_pathname) {
    free(wide_old_pathname);
    free(wide_new_pathname);
    return false;
  }

  BOOL ok = MoveFileExW(wide_old_pathname, wide_new_pathname, MOVEFILE_REPLACE_EXISTING);
  free(wide_old_pathname);
  free(wide_new_pathname);
  return ok != 0;
}

struct os_dir_t {
  HANDLE handle;
  WIN32_FIND_DATAW data;
  bool first;
};

os_dir_t *os_dir_open(const char *pathname) {
  wchar_t *wide_pathname = os_utf8_to_utf16(pathname);
  if (!wide_pathname) return NULL;

  size_t length = wcslen(wide_pathname);
  bool need_separator = length > 0 &&
    wide_pathname[length - 1] != L'/' &&
    wide_pathname[length - 1] != L'\\';

  wchar_t *pattern = malloc((length + (need_separator ? 1 : 0) + 2) * sizeof(wchar_t));
  if (!pattern) {
    free(wide_pathname);
    return NULL;
  }

  wcscpy(pattern, wide_pathname);
  if (need_separator) wcscat(pattern, L"\\");
  wcscat(pattern, L"*");
  free(wide_pathname);

  os_dir_t *self = malloc(sizeof(os_dir_t));
  if (!self) {
    free(pattern);
    return NULL;
  }

  self->handle = FindFirstFileW(pattern, &self->data);
  self->first = true;
  free(pattern);

  if (self->handle == INVALID_HANDLE_VALUE) {
    free(self);
    return NULL;
  }

  return self;
}

char *os_dir_next(os_dir_t *self) {
  for (;;) {
    if (self->first) {
      self->first = false;
    } else if (!FindNextFileW(self->handle, &self->data)) {
      return NULL;
    }

    if (wcscmp(self->data.cFileName, L".") == 0) continue;
    if (wcscmp(self->data.cFileName, L"..") == 0) continue;

    return os_utf16_to_utf8(self->data.cFileName);
  }
}

void os_dir_close(os_dir_t *self) {
  if (!self) return;
  if (self->handle != INVALID_HANDLE_VALUE) {
    FindClose(self->handle);
  }
  free(self);
}

size_t os_page_size(void) {
  SYSTEM_INFO info;
  GetSystemInfo(&info);
  return (size_t) info.dwPageSize;
}

void *os_allocate_page_aligned(size_t size) {
  if (size == 0) size = 1;
  return VirtualAlloc(NULL, size, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
}

void os_free_page_aligned(void *pointer) {
  if (pointer) VirtualFree(pointer, 0, MEM_RELEASE);
}

uint64_t os_monotonic_nanoseconds(void) {
  LARGE_INTEGER frequency;
  LARGE_INTEGER counter;
  QueryPerformanceFrequency(&frequency);
  QueryPerformanceCounter(&counter);

  uint64_t seconds = (uint64_t) (counter.QuadPart / frequency.QuadPart);
  uint64_t remainder = (uint64_t) (counter.QuadPart % frequency.QuadPart);
  return seconds * 1000000000ULL + (remainder * 1000000000ULL) / (uint64_t) frequency.QuadPart;
}

void os_sleep_nanoseconds(uint64_t nanoseconds) {
  if (nanoseconds == 0) {
    SwitchToThread();
    return;
  }

  if (nanoseconds >= 1000000ULL) {
    Sleep((DWORD) ((nanoseconds + 999999ULL) / 1000000ULL));
  } else {
    SwitchToThread();
  }
}

#else

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

#endif
