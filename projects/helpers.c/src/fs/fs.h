#pragma once

bool fs_exists(const char *pathname);
bool fs_is_file(const char *pathname);
bool fs_is_directory(const char *pathname);

char *fs_read(const char *pathname);
void fs_write(const char *pathname, const char *string);

void fs_ensure_directory(const char *pathname);
void fs_ensure_file(const char *pathname);

void fs_delete_file(const char *pathname);
void fs_delete_directory(const char *pathname);
void fs_delete_recursive(const char *pathname);
