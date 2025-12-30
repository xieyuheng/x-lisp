#pragma once

extern const object_class_t hashtag_class;

struct hashtag_t {
    struct object_header_t header;
    char *string;
};

hashtag_t *intern_hashtag(const char *string);
void hashtag_free(hashtag_t *self);

const char *hashtag_string(const hashtag_t *self);
size_t hashtag_length(const hashtag_t *self);

bool hashtag_p(value_t value);
hashtag_t *to_hashtag(value_t value);

void hashtag_print(const hashtag_t *self);
uint64_t hashtag_hash_code(const hashtag_t *self);
ordering_t hashtag_compare(const hashtag_t *lhs, const hashtag_t *rhs);
