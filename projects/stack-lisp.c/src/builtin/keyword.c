#include "index.h"

value_t x_keyword_p(value_t value) {
  return x_bool(keyword_p(value));
}

value_t x_keyword_length(value_t keyword) {
  return x_int(keyword_length(to_keyword(keyword)));
}

value_t x_keyword_to_string(value_t keyword) {
  return x_object(make_xstring(keyword_string(to_keyword(keyword))));
}

value_t x_keyword_append(value_t left, value_t right) {
  char *string = string_append(
    keyword_string(to_keyword(left)),
    keyword_string(to_keyword(right)));
  keyword_t *keyword = intern_keyword(string);
  string_free(string);
  return x_object(keyword);
}

value_t x_keyword_concat(value_t list) {
  buffer_t *buffer = make_buffer();
  int64_t length = to_int64(x_list_length(list));
  for (int64_t i = 0; i < length; i++) {
    value_t element = x_list_get(x_int(i), list);
    buffer_append_string(buffer, keyword_string(to_keyword(element)));
  }

  char *content = buffer_to_string(buffer);
  value_t result = x_object(intern_keyword(content));
  string_free(content);
  buffer_free(buffer);
  return result;
}
