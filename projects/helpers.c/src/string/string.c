#include "index.h"

void
string_free(char *self) {
    free(self);
}

char*
string_copy(const char *self) {
    size_t length = strlen(self);
    char *string = malloc(length + 1);
    assert(string);
    strcpy(string, self);
    return string;
}

size_t
string_length(const char *self) {
    return strlen(self);
}

char *
string_empty(void) {
    char *s = malloc(1);
    s[0] = '\0';
    return s;
}

bool
string_equal(const char *left, const char *right) {
    if (left == right) return true;

    return strcmp(left, right) == 0;
}

bool
string_is_empty(const char *self) {
    return string_equal(self, "");
}

bool
string_is_blank(const char *self) {
    for (size_t i = 0; i < string_length(self); i++) {
        if (!char_is_space(self[i])) {
            return false;
        }
    }

    return true;
}

size_t
string_bernstein_hash(const char *self) {
    const char *pointer = (const char *) self;
    size_t hash = 0;
    while (*pointer)
        hash = 33 * hash ^ *pointer++;
    return hash;
}

bool
string_is_int_with_base(const char *self, size_t base) {
    char *end = NULL;
    strtol(self, &end, base);
    if (end == self) return false;
    return *end == '\0';
}

bool
string_is_int(const char *self) {
    char *end = NULL;
    strtol(self, &end, 0);
    if (end == self) return false;
    return *end == '\0';
}

int64_t
string_parse_int_with_base(const char *self, size_t base) {
    char *end = NULL;
    return strtol(self, &end, base);
}

uint64_t
string_parse_uint_with_base(const char *self, size_t base) {
    char *end = NULL;
    return strtoul(self, &end, base);
}

int64_t
string_parse_int(const char *self) {
    char *end = NULL;
    return strtol(self, &end, 0);
}

uint64_t
string_parse_uint(const char *self) {
    char *end = NULL;
    return strtoul(self, &end, 0);
}

bool
string_is_double(const char *self) {
    char *end = NULL;
    strtod(self, &end);
    if (end == self) return false;
    return *end == '\0';
}

double
string_parse_double(const char *self) {
    char *end = NULL;
    return strtod(self, &end);
}

bool
string_starts_with(const char *target, const char *prefix) {
    size_t target_length = strlen(target);
    size_t prefix_length = strlen(prefix);

    if (target_length < prefix_length) return false;

    return strncmp(target, prefix, prefix_length) == 0;
}

bool
string_ends_with(const char *target, const char *postfix) {
    size_t target_length = strlen(target);
    size_t postfix_length = strlen(postfix);

    if (target_length < postfix_length) return false;

    return strncmp(target + (target_length - postfix_length),
                   postfix,
                   postfix_length) == 0;
}

char *
string_append(const char *left, const char *right) {
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

char *
string_slice(const char *self, size_t start, size_t end) {
    assert(end >= start);
    assert(end <= string_length(self));
    size_t length = end - start;
    char *result = malloc(length + 1);
    memcpy(result, self + start, length);
    result[length] = '\0';
    return result;
}

int
string_find_index(const char *self, char ch) {
    char *p = strchr(self, ch);
    if (!p) return -1;
    else return (int)(p - self);
}

size_t
string_count_char(const char *self, char ch) {
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

size_t
string_count_substring(const char *self, const char* substring) {
    size_t count = 0;
    size_t length = strlen(self);
    for (size_t i = 0; i < length; i++) {
        if (string_starts_with(self+i, substring)) count++;
    }

    return count;
}

char *
string_to_lower_case(const char *self) {
    char *result = string_copy(self);
    for (size_t i = 0; i < string_length(result); i++) {
        result[i] = tolower((unsigned char) result[i]);
    }

    return result;
}

char *
string_to_upper_case(const char *self) {
    char *result = string_copy(self);
    for (size_t i = 0; i < string_length(result); i++) {
        result[i] = toupper((unsigned char) result[i]);
    }

    return result;
}

bool
string_equal_mod_case(const char *left, const char *right) {
    char *left_upper = string_to_upper_case(left);
    char *right_upper = string_to_upper_case(right);

    bool result = string_equal(left_upper, right_upper);

    free(left_upper);
    free(right_upper);

    return result;
}

char *
string_next_word(const char *self, size_t *cursor_pointer) {
    size_t cursor = *cursor_pointer;
    while (cursor < string_length(self)) {
        char c = self[cursor];
        if (char_is_space(c)) {
            cursor++;
        } else {
            break;
        }
    }

    string_builder_t *builder = make_string_builder();
    while (cursor < string_length(self)) {
        char c = self[cursor];
        if (char_is_space(c)) {
            break;
        } else {
            string_builder_append_char(builder, c);
            cursor++;
        }
    }

    char *word = string_builder_produce(builder);
    string_builder_free(builder);
    *cursor_pointer = cursor;

    if (string_length(word) == 0) {
        string_free(word);
        return NULL;
    } else {
        return word;
    }
}

char *
string_next_line(const char *self, size_t *cursor_pointer) {
    size_t cursor = *cursor_pointer;
    if (cursor >= string_length(self)) {
        return NULL;
    }

    string_builder_t *builder = make_string_builder();
    while (cursor < string_length(self)) {
        char c = self[cursor];
        if (c == '\n') {
            cursor++;
            break;
        } else {
            string_builder_append_char(builder, c);
            cursor++;
        }
    }

    char *line = string_builder_produce(builder);
    string_builder_free(builder);
    *cursor_pointer = cursor;
    return line;
}

void
string_print(const char *self) {
    printf("%s" , self);
}
