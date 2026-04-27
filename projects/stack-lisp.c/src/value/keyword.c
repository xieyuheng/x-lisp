#include "index.h"

struct keyword_t {
  struct object_header_t header;
  char *string;
};

const object_class_t keyword_class = {
  .name = "keyword",
  .format_fn = (object_format_fn_t *) keyword_format,
  .hash_code_fn = (object_hash_code_fn_t *) keyword_hash_code,
  .compare_fn = (object_compare_fn_t *) keyword_compare,
};

static record_t *static_keyword_record = NULL;

keyword_t *intern_keyword(const char *string) {
  if (!static_keyword_record) {
    static_keyword_record = make_record();
  }

  keyword_t *found = record_get(static_keyword_record, string);
  if (found) {
    return found;
  }

  keyword_t *self = new(keyword_t);
  self->header.class = &keyword_class;
  self->header.is_static = true;
  self->string = string_copy(string);
  record_insert_or_fail(static_keyword_record, string, self);
  return self;
}

void keyword_free(keyword_t *self) {
  string_free(self->string);
  free(self);
}

const char *keyword_string(const keyword_t *self) {
  return self->string;
}

size_t keyword_length(const keyword_t *self) {
  return string_length(self->string);
}

bool keyword_p(value_t value) {
  return object_p(value) &&
    to_object(value)->header.class == &keyword_class;
}

keyword_t *to_keyword(value_t value) {
  assert(keyword_p(value));
  return (keyword_t *) to_object(value);
}

void keyword_format(buffer_t *buffer, object_circle_ctx_t *ctx, const keyword_t *self) {
  (void) ctx;
  format_string(buffer, ":");
  format_string(buffer, keyword_string(self));
}

hash_code_t keyword_hash_code(const keyword_t *self) {
  return 5 * string_hash_code(self->string);
}

ordering_t keyword_compare(const keyword_t *lhs, const keyword_t *rhs) {
  return string_compare_lexical(lhs->string, rhs->string);
}
