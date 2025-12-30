#include "index.h"

const object_class_t hashtag_class = {
    .name = "hashtag",
    .print_fn = (object_print_fn_t *) hashtag_print,
    .hash_code_fn = (object_hash_code_fn_t *) hashtag_hash_code,
    .compare_fn = (object_compare_fn_t *) hashtag_compare,
};

static record_t *global_hashtag_record = NULL;

hashtag_t *
intern_hashtag(const char *string) {
    if (!global_hashtag_record) {
        global_hashtag_record = make_record();
    }

    hashtag_t *found = record_get(global_hashtag_record, string);
    if (found) {
        return found;
    }

    hashtag_t *self = new(hashtag_t);
    self->header.class = &hashtag_class;
    self->string = string_copy(string);
    record_insert_or_fail(global_hashtag_record, string, self);
    return self;
}

void
hashtag_free(hashtag_t *self) {
    string_free(self->string);
    free(self);
}

const char *
hashtag_string(const hashtag_t *self) {
    return self->string;
}

size_t
hashtag_length(const hashtag_t *self) {
    return string_length(self->string);
}

bool
hashtag_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &hashtag_class;
}

hashtag_t *
to_hashtag(value_t value) {
    assert(hashtag_p(value));
    return (hashtag_t *) to_object(value);
}

void
hashtag_print(const hashtag_t *self) {
    string_print("#");
    string_print(hashtag_string(self));
}

uint64_t
hashtag_hash_code(const hashtag_t *self) {
    return 5 * string_hash_code(self->string);
}

ordering_t
hashtag_compare(const hashtag_t *lhs, const hashtag_t *rhs) {
    return string_compare_lexical(lhs->string, rhs->string);
}
