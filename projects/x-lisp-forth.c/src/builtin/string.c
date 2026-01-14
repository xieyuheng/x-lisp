#include "index.h"

value_t
x_string_p(value_t value) {
    return x_bool(xstring_p(value));
}

value_t
x_string_length(value_t string) {
    return x_int(xstring_length(to_xstring(string)));
}

value_t
x_string_empty_p(value_t string) {
    return x_bool(xstring_is_empty(to_xstring(string)));
}

value_t
x_string_append(value_t left, value_t right) {
    return x_object(xstring_append(to_xstring(left), to_xstring(right)));
}

value_t
x_string_concat(value_t list) {
    string_builder_t *builder = make_string_builder();
    for (int64_t i = 0; i < to_int64(x_list_length(list)); i++) {
        value_t element = x_list_get(x_int(i), list);
        string_builder_append_string(builder, to_xstring(element)->string);
    }

    char *content = string_builder_produce(builder);
    value_t result = x_object(make_xstring(content));
    string_builder_free(builder);
    return result;
}
