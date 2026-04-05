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

char *
fs_read(const char *pathname) {
    file_t *file = open_file_or_fail(pathname, "w");
    char *string = (char *) file_read_bytes(file);
    file_close(file);
    return string;
}

void
fs_write(const char *pathname, const char *string) {
    file_t *file = open_file_or_fail(pathname, "w");
    file_write_string(file, string);
    file_close(file);
}

static void
fs_make_directory(const char *pathname) {
    if (fs_exists(pathname)) {
        assert(fs_is_directory(pathname));
        return;
    } else {
        int ok = mkdir(pathname, 0777);
        assert(ok == 0);
        return;
    }
}

static void
fs_ensure_directory_recur(path_t *path) {
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
    return;
}

void
fs_ensure_directory(const char *pathname) {
    path_t *path = make_path(pathname);
    fs_ensure_directory_recur(path);
    path_free(path);
}

void
fs_ensure_file(const char *pathname) {
    path_t *path = make_path(pathname);
    assert(path_segment_length(path) > 0);
    char *segment = path_pop_segment(path);
    fs_ensure_directory_recur(path);
    path_push_segment(path, segment);
    fs_write(path_raw_string(path), "");
    path_free(path);
}

void
fs_delete_file(const char *pathname) {
    if (fs_exists(pathname)) {
        assert(fs_is_file(pathname));
        int ok = unlink(pathname);
        assert(ok == 0);
    }
}

void
fs_delete_directory(const char *pathname) {
    if (fs_exists(pathname)) {
        assert(fs_is_directory(pathname));
        int ok = rmdir(pathname);
        assert(ok == 0);
    }
}
