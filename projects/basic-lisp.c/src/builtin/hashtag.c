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


value_t
x_hashtag_concat(value_t list) {
    string_builder_t *builder = make_string_builder();
    int64_t length = to_int64(x_list_length(list));
    for (int64_t i = 0; i < length; i++) {
        value_t element = x_list_get(x_int(i), list);
        string_builder_append_string(builder, to_hashtag(element)->string);
    }

    char *content = string_builder_produce(builder);
    value_t result = x_object(intern_hashtag(content));
    string_free(content);
    string_builder_free(builder);
    return result;
}
