#pragma once

path_t *make_path(const char *string);
void path_free(path_t *self);

path_t *make_cwd_path(void);

bool path_is_relative(const path_t *self);
bool path_is_absolute(const path_t *self);

path_t *path_copy(const path_t *self);
bool path_equal(path_t *x, path_t *y);

void path_join(path_t *self, const char *string);
void path_join_extension(path_t *self, const char *extension);

const char *path_raw_string(const path_t *self);
void print_path(const path_t *self);

size_t path_segment_length(const path_t *self);
const char *path_top_segment(const path_t *self);
const char *path_get_segment(const path_t *self, size_t index);
char *path_pop_segment(path_t *self);
void path_push_segment(path_t *self, char *segment);

path_t *path_relative(path_t *from, path_t *to);
void print_path_relative_to(path_t *from, path_t *to);
void print_path_relative_to_cwd(path_t *to);
