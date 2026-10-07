#pragma once

#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>

#include "types.h"

// - process / console

char *os_getcwd(void);

// - file

FILE *os_fopen(const char *pathname, const char *mode);
int os_file_descriptor(FILE *file);
int64_t os_file_size(FILE *file);
bool os_file_sync(FILE *file);
void os_file_lock(FILE *file);
void os_file_unlock(FILE *file);

int os_open_output_truncate(const char *pathname);
int os_dup(int fd);
int os_dup2(int old_fd, int new_fd);
int os_close(int fd);

// - filesystem

bool os_path_exists(const char *pathname);
bool os_path_is_file(const char *pathname);
bool os_path_is_directory(const char *pathname);

bool os_make_directory(const char *pathname);
bool os_delete_file(const char *pathname);
bool os_delete_directory(const char *pathname);
bool os_delete(const char *pathname);
bool os_rename(const char *old_pathname, const char *new_pathname);

os_dir_t *os_dir_open(const char *pathname);
char *os_dir_next(os_dir_t *self);
void os_dir_close(os_dir_t *self);

// - memory

size_t os_page_size(void);
void *os_allocate_page_aligned(size_t size);
void os_free_page_aligned(void *pointer);

// - time

uint64_t os_monotonic_nanoseconds(void);
void os_sleep_nanoseconds(uint64_t nanoseconds);

