#pragma once

path_t *make_path(const char *string);
void path_free(path_t *self);

path_t *make_path_cwd(void);

bool path_is_relative(const path_t *self);
bool path_is_absolute(const path_t *self);

path_t *path_copy(const path_t *self);
bool path_equal(path_t *x, path_t *y);

void path_join_mut(path_t *self, const char *string);
path_t *path_join(const path_t *self, const char *string);

void path_resolve_mut(path_t *self, const char *string);
path_t *path_resolve(const path_t *self, const char *string);

const char *path_string(const path_t *self);

path_t *path_relative(path_t *from, path_t *to);
void path_relative_print(path_t *from, path_t *to);
void path_relative_cwd_print(path_t *to);
