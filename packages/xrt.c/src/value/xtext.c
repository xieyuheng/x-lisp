#include "index.h"

struct xtext_t {
  struct object_header_t header;
  text_t *text;
};

const object_class_t xtext_class = {
  .name = "string",
  .equal_fn = (object_equal_fn_t *) xtext_equal,
  .write_fn = (object_write_fn_t *) xtext_format,
  .hash_code_fn = (object_hash_code_fn_t *) xtext_hash_code,
  .compare_fn = (object_compare_fn_t *) xtext_compare,
  .free_fn = (free_fn_t *) xtext_free,
};

static record_t *static_xtext_record = NULL;

xtext_t *make_static_xtext(const char *string) {
  if (!static_xtext_record) {
    static_xtext_record = make_record();
  }

  xtext_t *found = record_get(static_xtext_record, string);
  if (found) {
    return found;
  }

  xtext_t *self = new(xtext_t);
  self->header.class = &xtext_class;
  self->header.is_static = true;
  self->text = make_text(string);
  record_insert_or_fail(static_xtext_record, string, self);
  return self;
}

xtext_t *make_xtext_take_text(text_t *text) {
  xtext_t *self = new(xtext_t);
  self->header.class = &xtext_class;
  self->text = text;
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

xtext_t *make_xtext_take(char *string) {
  return make_xtext_take_text(make_text_take(string));
}

xtext_t *make_xtext(const char *string) {
  return make_xtext_take(string_copy(string));
}

void xtext_free(xtext_t *self) {
  text_free(self->text);
  free(self);
}

bool is_xtext(value_t value) {
  return is_object(value) &&
    to_object(value)->header.class == &xtext_class;
}

xtext_t *to_xtext(value_t value) {
  if (!is_xtext(value)) {
    if (is_object(value)) {
      object_t *object = to_object(value);
      who_printf("expected string, got object class: %s\n", object->header.class->name);
    } else {
      who_printf("expected string, tag: %ld\n", (int64_t) value_tag(value));
    }
    exit(1);
  }
  return (xtext_t *) to_object(value);
}

bool xtext_equal(const xtext_t *lhs, const xtext_t *rhs) {
  return text_equal(lhs->text, rhs->text);
}

void xtext_format(buffer_t *buffer, object_circle_ctx_t *ctx, const xtext_t *self) {
  (void) ctx;
  write_string(buffer, "\"");
  write_string(buffer, xtext_string(self));
  write_string(buffer, "\"");
}

hash_code_t xtext_hash_code(const xtext_t *self) {
  return string_hash_code(text_string(self->text));
}

ordering_t xtext_compare(const xtext_t *lhs, const xtext_t *rhs){
  return string_compare_lexical(text_string(lhs->text), text_string(rhs->text));
}

const text_t *xtext_text(const xtext_t *self) {
  return self->text;
}

const char *xtext_string(const xtext_t *self) {
  return text_string(self->text);
}

size_t xtext_length(const xtext_t *self) {
  return text_length(self->text);
}

bool xtext_is_empty(const xtext_t *self) {
  return xtext_length(self) == 0;
}

xtext_t *xtext_append(xtext_t *left, xtext_t *right) {
  return make_xtext_take(
    string_append(
      text_string(left->text),
      text_string(right->text)));
}
