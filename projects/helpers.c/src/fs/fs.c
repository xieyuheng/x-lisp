#include "index.h"

bool
fs_exists(const char *pathname) {
    return access(pathname, F_OK) != -1;
}

bool
fs_is_file(const char *pathname) {
    if (!fs_exists(pathname)) return false;

    struct stat st;
    if (stat(pathname, &st) == -1) return false;

    return S_ISREG(st.st_mode);
}

bool
fs_is_directory(const char *pathname) {
    if (!fs_exists(pathname)) return false;

    struct stat st;
    if (stat(pathname, &st) == -1) return false;

    return S_ISDIR(st.st_mode);
}
