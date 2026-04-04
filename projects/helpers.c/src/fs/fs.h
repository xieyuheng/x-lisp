#pragma once

bool fs_exists(const char *pathname);
bool fs_is_file(const char *pathname);
bool fs_is_directory(const char *pathname);
void fs_ensure_directory(const char *pathname);
