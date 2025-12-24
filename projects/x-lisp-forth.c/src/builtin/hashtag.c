#include "index.h"

value_t
x_hashtag_p(value_t value) {
    return x_bool(hashtag_p(value));
}

value_t
x_hashtag_length(value_t hashtag) {
    return x_int(hashtag_length(to_hashtag(hashtag)));
}

value_t
x_hashtag_to_string(value_t hashtag) {
    return x_object(make_xstring(string_copy(hashtag_string(to_hashtag(hashtag)))));
}

value_t
x_hashtag_append(value_t left, value_t right) {
    char *string = string_append(
        hashtag_string(to_hashtag(left)),
        hashtag_string(to_hashtag(right)));
    hashtag_t *hashtag = intern_hashtag(string);
    string_free(string);
    return x_object(hashtag);
}
