#pragma once

path_t *make_path(const char *string);
void path_free(path_t *self);
char *path_into_string(path_t *self);

path_t *make_cwd_path(void);

bool path_is_relative(const path_t *self);
bool path_is_absolute(const path_t *self);

path_t *path_copy(const path_t *self);
bool path_equal(path_t *x, path_t *y);

void path_join(path_t *self, const char *string);
void path_join_extension(path_t *self, const char *extension);

const char *path_raw_string(const path_t *self);
void format_path(buffer_t *buffer, const path_t *self);

size_t path_segment_length(const path_t *self);
const char *path_top_segment(const path_t *self);
const char *path_get_segment(const path_t *self, size_t index);
char *path_pop_segment(path_t *self);
void path_push_segment(path_t *self, char *segment);

path_t *path_relative(const path_t *from, const path_t *to);
void format_path_relative_to(buffer_t *buffer, const path_t *from, const path_t *to);
void format_path_relative_to_cwd(buffer_t *buffer, const path_t *to);
