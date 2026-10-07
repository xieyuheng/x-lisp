#include "index.h"

struct path_t {
  stack_t *segment_stack;
  char *string;
  char *root;
  bool is_absolute;
};

static void path_update_string(path_t *self);
static void path_execute(path_t *self, char *segment);

static char *path_normalize_separators(const char *string) {
  char *result = string_copy(string);
  for (size_t i = 0; result[i] != '\0'; i++) {
    if (result[i] == '\\') result[i] = '/';
  }
  return result;
}

static void path_clear(path_t *self) {
  while (!stack_is_empty(self->segment_stack)) {
    string_free(stack_pop(self->segment_stack));
  }
  string_free(self->root);
  self->root = string_copy("");
  self->is_absolute = false;
}

static size_t path_unc_root_length(const char *string) {
  const char *p = string + 2;
  const char *server_end = p;
  while (*server_end != '\0' && *server_end != '/') server_end++;
  if (*server_end != '/') return 2;

  const char *share = server_end + 1;
  const char *share_end = share;
  while (*share_end != '\0' && *share_end != '/') share_end++;
  return (size_t) (share_end - string);
}

static void path_assign(path_t *self, const char *string) {
  char *normalized = path_normalize_separators(string);
  path_clear(self);

  const char *cursor = normalized;

  if (isalpha((unsigned char) normalized[0]) &&
      normalized[1] == ':' &&
      normalized[2] == '/') {
    self->is_absolute = true;
    self->root = string_substring(normalized, 0, 2);
    cursor = normalized + 3;
  } else if (normalized[0] == '/' && normalized[1] == '/' && normalized[2] != '/') {
    self->is_absolute = true;
    size_t root_length = path_unc_root_length(normalized);
    self->root = string_substring(normalized, 0, root_length);
    cursor = normalized + root_length;
  } else if (normalized[0] == '/') {
    self->is_absolute = true;
    self->root = string_copy("");
    cursor = normalized + 1;
  } else {
    self->is_absolute = false;
    self->root = string_copy("");
    cursor = normalized;
  }

  while (*cursor != '\0') {
    while (*cursor == '/') cursor++;
    if (*cursor == '\0') break;

    const char *end = cursor;
    while (*end != '\0' && *end != '/') end++;

    char *segment = string_substring(cursor, 0, (size_t) (end - cursor));
    path_execute(self, segment);
    cursor = end;
  }

  string_free(normalized);
  path_update_string(self);
}

path_t *make_path(const char *string) {
  path_t *self = new(path_t);
  self->segment_stack = make_string_stack();
  self->string = string_copy("");
  self->root = string_copy("");
  self->is_absolute = false;
  path_assign(self, string);
  return self;
}

void path_free(path_t *self) {
  stack_free(self->segment_stack);
  string_free(self->string);
  string_free(self->root);
  free(self);
}

char *path_into_string(path_t *self) {
  char *result = self->string;
  self->string = NULL;
  stack_free(self->segment_stack);
  string_free(self->root);
  free(self);
  return result;
}

path_t *make_cwd_path(void) {
  char *cwd = os_getcwd();
  path_t *cwd_path = make_path(cwd);
  free(cwd);
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
} entry_t;

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

  entry->segment = string_substring(string, 0, (size_t) index);
  return entry;
}

static void path_update_string(path_t *self) {
  size_t length = stack_length(self->segment_stack);
  char *string = string_copy("");

  if (path_is_absolute(self)) {
    if (self->root[0] != '\0') {
      char *next = string_append(string, self->root);
      string_free(string);
      string = next;

      if (length > 0 || string_ends_with(self->root, ":")) {
        next = string_append(string, "/");
        string_free(string);
        string = next;
      }
    } else {
      char *next = string_append(string, "/");
      string_free(string);
      string = next;
    }
  }

  for (size_t i = 0; i < length; i++) {
    char *segment = stack_get(self->segment_stack, i);
    if (i > 0) {
      char *next = string_append(string, "/");
      string_free(string);
      string = next;
    }
    char *next = string_append(string, segment);
    string_free(string);
    string = next;
  }

  string_free(self->string);
  self->string = string;
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

static bool path_string_is_absolute_drive_or_unc(const char *string) {
  if (isalpha((unsigned char) string[0]) &&
      string[1] == ':' &&
      (string[2] == '/' || string[2] == '\\')) {
    return true;
  }

  return (string[0] == '/' && string[1] == '/' && string[2] != '/') ||
         (string[0] == '\\' && string[1] == '\\' && string[2] != '\\');
}

void path_join(path_t *self, const char *string) {
  if (path_string_is_absolute_drive_or_unc(string)) {
    path_assign(self, string);
    return;
  }

  char *normalized = path_normalize_separators(string);
  const char *cursor = normalized;

  while (*cursor != '\0') {
    while (*cursor == '/') cursor++;
    if (*cursor == '\0') break;

    const char *end = cursor;
    while (*end != '\0' && *end != '/') end++;

    char *segment = string_substring(cursor, 0, (size_t) (end - cursor));
    path_execute(self, segment);
    cursor = end;
  }

  string_free(normalized);
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

void write_path(buffer_t *buffer, const path_t *self) {
  write_string(buffer, path_raw_string(self));
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
  if (!((path_is_relative(from) && path_is_relative(to)) ||
        (path_is_absolute(from) && path_is_absolute(to)))) {
    who_printf("from and to must be both absolute or both relative\n");
    who_printf("  from: %s\n", path_raw_string(from));
    who_printf("  to: %s\n", path_raw_string(to));
    exit(1);
  }

  const char *from_root = from->root ? from->root : "";
  const char *to_root = to->root ? to->root : "";
  bool roots_match = string_equal(from_root, to_root) ||
    from_root[0] == '\0' ||
    to_root[0] == '\0';
  if (!roots_match) {
    who_printf("from and to must have the same root\n");
    who_printf("  from: %s\n", path_raw_string(from));
    who_printf("  to: %s\n", path_raw_string(to));
    exit(1);
  }

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

void write_path_relative_to(buffer_t *buffer, const path_t *from, const path_t *to) {
  path_t *relative_path = path_relative(from, to);
  write_template(buffer, "%s", path_raw_string(relative_path));
  path_free(relative_path);
}

void write_path_relative_to_cwd(buffer_t *buffer, const path_t *to) {
  path_t *cwd_path = make_cwd_path();
  write_path_relative_to(buffer, cwd_path, to);
  path_free(cwd_path);
}
