#include "index.h"

struct path_t {
  stack_t *segment_stack;
  char *string;
  bool is_absolute;
};

path_t *make_path(const char *string) {
  path_t *self = new(path_t);
  self->segment_stack = make_string_stack();
  if (string_starts_with(string, "/"))
    self->is_absolute = true;
  path_join(self, string);
  return self;
}

void path_free(path_t *self) {
  stack_free(self->segment_stack);
  string_free(self->string);
  free(self);
}

char *path_into_string(path_t *self) {
  char *result = self->string;
  self->string = NULL;
  stack_free(self->segment_stack);
  free(self);
  return result;
}

path_t *make_cwd_path(void) {
  char *cwd = getcwd(NULL, 0);
  path_t *cwd_path = make_path(cwd);
  string_free(cwd);
  return cwd_path;
}

bool path_is_relative(const path_t *self) {
  return !self->is_absolute;
}

bool path_is_absolute(const path_t *self) {
  return self->is_absolute;
}

path_t *path_copy(const path_t *self) {
  return make_path(path_raw_string(self));
}

bool path_equal(path_t *x, path_t *y) {
  return string_equal(path_raw_string(x), path_raw_string(y));
}

typedef struct {
  const char *string;
  char *segment;
}  entry_t;

static entry_t *next_segment(const char *string) {
  if (string_is_empty(string))
    return NULL;

  int index = string_find_char_index(string, '/');
  if (index == -1) {
    entry_t *entry = new(entry_t);
    entry->string = string + string_length(string);
    entry->segment = string_copy(string);
    return entry;
  }

  entry_t *entry = new(entry_t);
  entry->string = string + index;
  if (string_length(entry->string) > 0)
    entry->string++;

  entry->segment = string_substring(string, 0, index);
  return entry;
}

static void path_update_string(path_t *self) {
  size_t length = stack_length(self->segment_stack);
  size_t size = 0;
  for (size_t i = 0; i < length; i++) {
    char *segment = stack_get(self->segment_stack, i);
    size += string_length(segment);
    size += 1;
  }

  string_free(self->string);
  char *string = NULL;
  if (path_is_absolute(self)) {
    // one more for ending \0
    self->string = allocate(size + 1 + 1);
    self->string[0] = '/';
    string = self->string + 1;
  } else {
    // one more for ending \0
    self->string = allocate(size + 1);
    string = self->string;
  }

  for (size_t i = 0; i < length; i++) {
    char *segment = stack_get(self->segment_stack, i);
    strcat(string, segment);
    string += string_length(segment);
    if (i == length - 1) {
      string[0] = '\0';
    } else {
      string[0] = '/';
      string++;
    }
  }
}

static void path_execute(path_t *self, char *segment) {
  if (string_is_empty(segment)) {
    string_free(segment);
  } else if (string_equal(segment, ".")) {
    string_free(segment);
  } else if (string_equal(segment, "..")) {
    if (stack_is_empty(self->segment_stack) ||
        string_equal(stack_top(self->segment_stack), "..")) {
      stack_push(self->segment_stack, segment);
    } else {
      string_free(segment);
      segment = stack_pop(self->segment_stack);
      string_free(segment);
    }
  } else {
    stack_push(self->segment_stack, segment);
  }
}

void path_join(path_t *self, const char *string) {
  entry_t *entry = next_segment(string);
  while (entry) {
    path_execute(self, entry->segment);
    string = entry->string;
    free(entry);
    entry = next_segment(string);
  }

  path_update_string(self);
}

void path_join_extension(path_t *self, const char *extension) {
  char *segment = path_pop_segment(self);
  char *new_segment = string_append(segment, extension);
  string_free(segment);
  path_push_segment(self, new_segment);
  path_update_string(self);
}

const char *path_raw_string(const path_t *self) {
  assert(self->string);
  return self->string;
}

void format_path(buffer_t *buffer, const path_t *self) {
  format_string(buffer, path_raw_string(self));
}

size_t path_segment_length(const path_t *self) {
  return stack_length(self->segment_stack);
}

const char *path_top_segment(const path_t *self) {
  return stack_top(self->segment_stack);
}

const char *path_get_segment(const path_t *self, size_t index) {
  return stack_get(self->segment_stack, index);
}

char *path_pop_segment(path_t *self) {
  char *segment = stack_pop(self->segment_stack);
  path_update_string(self);
  return segment;
}

void path_push_segment(path_t *self, char *segment) {
  stack_push(self->segment_stack, segment);
  path_update_string(self);
}

static size_t find_relative_index(const path_t *from, const path_t *to) {
  for (size_t i = 0; i < stack_length(from->segment_stack); i++) {
    if (i >= stack_length(to->segment_stack)) {
      return i;
    }

    char *from_segment = stack_get(from->segment_stack, i);
    char *to_segment = stack_get(to->segment_stack, i);

    if (!string_equal(from_segment, to_segment)) {
      return i;
    }
  }

  return stack_length(from->segment_stack);
}

path_t *path_relative(const path_t *from, const path_t *to) {
  assert((path_is_relative(from) && path_is_relative(to)) ||
         (path_is_absolute(from) && path_is_absolute(to)));

  size_t relative_index = find_relative_index(from, to);
  size_t from_length = stack_length(from->segment_stack);
  size_t to_length = stack_length(to->segment_stack);

  path_t *relative_path = make_path("");

  for (size_t i = 0; i < from_length - relative_index; i++) {
    stack_push(relative_path->segment_stack, string_copy(".."));
  }

  for (size_t i = 0; i < to_length - relative_index; i++) {
    size_t segment_index = relative_index + i;
    char *to_segment = stack_get(to->segment_stack, segment_index);
    stack_push(relative_path->segment_stack, string_copy(to_segment));
  }

  path_update_string(relative_path);

  return relative_path;
}

void format_path_relative_to(buffer_t *buffer, const path_t *from, const path_t *to) {
  path_t *relative_path = path_relative(from, to);
  format_template(buffer, "%s", path_raw_string(relative_path));
  path_free(relative_path);
}

void format_path_relative_to_cwd(buffer_t *buffer, const path_t *to) {
  path_t *cwd_path = make_cwd_path();
  format_path_relative_to(buffer, cwd_path, to);
  path_free(cwd_path);
}
