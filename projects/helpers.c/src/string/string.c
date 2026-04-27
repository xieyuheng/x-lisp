#include "index.h"

void string_free(char *self) {
  free(self);
}

char* string_copy(const char *self) {
  size_t length = strlen(self);
  char *string = malloc(length + 1);
  assert(string);
  strcpy(string, self);
  return string;
}

size_t string_length(const char *self) {
  return strlen(self);
}

char *string_empty(void) {
  char *s = malloc(1);
  s[0] = '\0';
  return s;
}

bool string_equal(const char *left, const char *right) {
  assert(left);
  assert(right);

  if (left == right) return true;

  return strcmp(left, right) == 0;
}

bool string_is_empty(const char *self) {
  return string_equal(self, "");
}

bool string_is_blank(const char *self) {
  for (size_t i = 0; i < string_length(self); i++) {
    if (!char_is_blank(self[i])) {
      return false;
    }
  }

  return true;
}

hash_code_t string_hash_code(const char *self) {
  const char *pointer = (const char *) self;
  uint32_t code = 5381; // any big prime number would do.
  while (*pointer)
    code = (code << 5) + code + *pointer++;
  return code;
}

bool string_is_int_with_base(const char *self, size_t base) {
  char *end = NULL;
  strtol(self, &end, base);
  if (end == self) return false;
  return *end == '\0';
}

bool string_is_int(const char *self) {
  char *end = NULL;
  strtol(self, &end, 0);
  if (end == self) return false;
  return *end == '\0';
}

int64_t string_parse_int_with_base(const char *self, size_t base) {
  char *end = NULL;
  return strtol(self, &end, base);
}

uint64_t string_parse_uint_with_base(const char *self, size_t base) {
  char *end = NULL;
  return strtoul(self, &end, base);
}

int64_t string_parse_int(const char *self) {
  char *end = NULL;
  return strtol(self, &end, 0);
}

uint64_t string_parse_uint(const char *self) {
  char *end = NULL;
  return strtoul(self, &end, 0);
}

bool string_is_double(const char *self) {
  char *end = NULL;
  strtod(self, &end);
  if (end == self) return false;
  return *end == '\0';
}

double string_parse_double(const char *self) {
  char *end = NULL;
  return strtod(self, &end);
}

bool string_starts_with(const char *target, const char *prefix) {
  size_t target_length = strlen(target);
  size_t prefix_length = strlen(prefix);

  if (target_length < prefix_length) return false;

  return strncmp(target, prefix, prefix_length) == 0;
}

bool string_ends_with(const char *target, const char *postfix) {
  size_t target_length = strlen(target);
  size_t postfix_length = strlen(postfix);

  if (target_length < postfix_length) return false;

  return strncmp(target + (target_length - postfix_length),
           postfix,
           postfix_length) == 0;
}

char *string_append(const char *left, const char *right) {
  assert(left);
  assert(right);
  size_t left_length = strlen(left);
  size_t right_length = strlen(right);
  char *result = malloc(left_length + right_length + 1);
  result[0] = '\0';
  strcat(result, left);
  strcat(result, right);
  return result;
}

char *string_substring(const char *self, size_t start, size_t end) {
  assert(end >= start);
  assert(end <= string_length(self));
  size_t length = end - start;
  char *result = malloc(length + 1);
  memcpy(result, self + start, length);
  result[length] = '\0';
  return result;
}

int string_find_char_index(const char *self, char ch) {
  char *p = strchr(self, ch);
  if (!p) return -1;
  else return (int) (p - self);
}

int string_find_last_char_index(const char *self, char ch) {
  for (size_t i = 0; i < string_length(self); i++) {
    size_t last_index = string_length(self) - 1 - i;
    if (self[last_index] == ch) {
      return last_index;
    }
  }

  return -1;
}

int string_find_blank_index(const char *self) {
  for (size_t i = 0; i < string_length(self); i++) {
    if (char_is_blank(self[i])) {
      return i;
    }
  }

  return -1;
}

int string_find_last_blank_index(const char *self) {
  for (size_t i = 0; i < string_length(self); i++) {
    size_t last_index = string_length(self) - 1 - i;
    if (char_is_blank(self[last_index])) {
      return last_index;
    }
  }

  return -1;
}

int string_find_non_blank_index(const char *self) {
  for (size_t i = 0; i < string_length(self); i++) {
    if (!char_is_blank(self[i])) {
      return i;
    }
  }

  return -1;
}

int string_find_last_non_blank_index(const char *self) {
  for (size_t i = 0; i < string_length(self); i++) {
    size_t last_index = string_length(self) - 1 - i;
    if (!char_is_blank(self[last_index])) {
      return last_index;
    }
  }

  return -1;
}


char *string_trim_left(const char *self) {
  return string_trim_start(self);
}

char *string_trim_right(const char *self) {
  return string_trim_end(self);
}

char *string_trim_start(const char *self) {
  int index = string_find_non_blank_index(self);
  if (index == -1) {
    return string_copy(self);
  } else {
    return string_substring(self, index, string_length(self));
  }
}

char *string_trim_end(const char *self) {
  int index = string_find_last_non_blank_index(self);
  if (index == -1) {
    return string_copy(self);
  } else {
    return string_substring(self, 0, index + 1);
  }
}

char *string_trim(const char *self) {
  int start = string_find_non_blank_index(self);
  int end = string_find_last_non_blank_index(self);
  if (start == -1 && end == -1) {
    return string_copy(self);
  } else if (start == -1 && end != -1) {
    return string_substring(self, 0, end + 1);
  } else if (start != -1 && end == -1) {
    return string_substring(self, start, string_length(self));
  } else {
    return string_substring(self, start, end + 1);
  }
}

int string_find_substring_index(const char *self, const char *substring) {
  assert(substring);
  char *p = strstr(self, substring);
  if (!p) return -1;
  else return (int) (p - self);
}

bool string_contains(const char *self, const char* substring) {
  return string_find_substring_index(self, substring) != -1;
}

size_t string_count_char(const char *self, char ch) {
  size_t count = 0;
  size_t length = strlen(self);
  for (size_t i = 0; i < length; i++) {
    if (self[i] == ch) count++;
  }

  return count;
}

bool string_has_char(const char *self, char ch) {
  return string_count_char(self, ch) > 0;
}

size_t string_count_substring(const char *self, const char* substring) {
  size_t count = 0;
  size_t length = strlen(self);
  for (size_t i = 0; i < length; i++) {
    if (string_starts_with(self+i, substring)) count++;
  }

  return count;
}

char *string_to_lower_case(const char *self) {
  char *result = string_copy(self);
  for (size_t i = 0; i < string_length(result); i++) {
    result[i] = tolower((unsigned char) result[i]);
  }

  return result;
}

char *string_to_upper_case(const char *self) {
  char *result = string_copy(self);
  for (size_t i = 0; i < string_length(result); i++) {
    result[i] = toupper((unsigned char) result[i]);
  }

  return result;
}

bool string_equal_mod_case(const char *left, const char *right) {
  char *left_upper = string_to_upper_case(left);
  char *right_upper = string_to_upper_case(right);

  bool result = string_equal(left_upper, right_upper);

  free(left_upper);
  free(right_upper);

  return result;
}

char *string_next_word(const char *self, size_t *cursor_pointer) {
  size_t cursor = *cursor_pointer;

  while (self[cursor] != 0) {
    char c = self[cursor];
    if (char_is_blank(c)) {
      cursor++;
    } else {
      break;
    }
  }

  if (self[cursor] == 0) {
    return NULL;
  }

  int index = string_find_blank_index(self + cursor);
  if (index != -1) {
    *cursor_pointer += index + 1;
    return string_substring(self, cursor, cursor + index);
  } else {
    *cursor_pointer += string_length(self + cursor);
    return string_copy(self + cursor);
  }
}

char *string_next_line(const char *self, size_t *cursor_pointer) {
  size_t cursor = *cursor_pointer;
  if (self[cursor] == 0) {
    return NULL;
  }

  int index = string_find_char_index(self + cursor, '\n');
  if (index != -1) {
    *cursor_pointer += index + 1;
    return string_substring(self, cursor, cursor + index);
  } else {
    *cursor_pointer += string_length(self + cursor);
    return string_copy(self + cursor);
  }
}

char *string_next_split(const char *self, const char *delimiter, size_t *cursor_pointer) {
  size_t cursor = *cursor_pointer;
  if (self[cursor] == 0) {
    return NULL;
  }

  int index = string_find_substring_index(self + cursor, delimiter);
  if (index != -1) {
    *cursor_pointer += index + string_length(delimiter);
    return string_substring(self, cursor, cursor + index);
  } else {
    *cursor_pointer += string_length(self + cursor);
    return string_copy(self + cursor);
  }
}

void print_string(const char *self) {
  printf("%s" , self);
}
