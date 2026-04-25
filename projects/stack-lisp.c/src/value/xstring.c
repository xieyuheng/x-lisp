#include "index.h"

struct xstring_t {
  struct object_header_t header;
  text_t *text;
};

const object_class_t xstring_class = {
  .name = "string",
  .equal_fn = (object_equal_fn_t *) xstring_equal,
  .format_fn = (object_format_fn_t *) xstring_format,
  .hash_code_fn = (object_hash_code_fn_t *) xstring_hash_code,
  .compare_fn = (object_compare_fn_t *) xstring_compare,
  .free_fn = (free_fn_t *) xstring_free,
};

static record_t *static_xstring_record = NULL;

xstring_t *make_static_xstring(const char *string) {
  if (!static_xstring_record) {
    static_xstring_record = make_record();
  }

  xstring_t *found = record_get(static_xstring_record, string);
  if (found) {
    return found;
  }

  xstring_t *self = new(xstring_t);
  self->header.class = &xstring_class;
  self->header.is_static = true;
  self->text = make_text(string);
  record_insert_or_fail(static_xstring_record, string, self);
  return self;
}

xstring_t *make_xstring_take_text(text_t *text) {
  xstring_t *self = new(xstring_t);
  self->header.class = &xstring_class;
  self->text = text;
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

xstring_t *make_xstring_take(char *string) {
  return make_xstring_take_text(make_text_take(string));
}

xstring_t *make_xstring(const char *string) {
  return make_xstring_take(string_copy(string));
}

void xstring_free(xstring_t *self) {
  text_free(self->text);
  free(self);
}

bool xstring_p(value_t value) {
  return object_p(value) &&
    to_object(value)->header.class == &xstring_class;
}

xstring_t *to_xstring(value_t value) {
  assert(xstring_p(value));
  return (xstring_t *) to_object(value);
}

bool xstring_equal(const xstring_t *lhs, const xstring_t *rhs) {
  return text_equal(lhs->text, rhs->text);
}

void xstring_format(buffer_t *buffer, object_circle_ctx_t *ctx, const xstring_t *self) {
  (void) ctx;
  buffer_append_string(buffer, "\"");
  buffer_append_string(buffer, text_string(self->text));
  buffer_append_string(buffer, "\"");
}

hash_code_t xstring_hash_code(const xstring_t *self) {
  return string_hash_code(text_string(self->text));
}

ordering_t xstring_compare(const xstring_t *lhs, const xstring_t *rhs){
  return string_compare_lexical(text_string(lhs->text), text_string(rhs->text));
}

const text_t *xstring_text(const xstring_t *self) {
  return self->text;
}

const char *xstring_string(const xstring_t *self) {
  return text_string(self->text);
}

size_t xstring_length(const xstring_t *self) {
  return text_length(self->text);
}

bool xstring_is_empty(const xstring_t *self) {
  return xstring_length(self) == 0;
}

xstring_t *xstring_append(xstring_t *left, xstring_t *right) {
  return make_xstring_take(
    string_append(
      text_string(left->text),
      text_string(right->text)));
}
