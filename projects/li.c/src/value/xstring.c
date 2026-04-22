#include "index.h"

struct xstring_t {
  struct object_header_t header;
  size_t length;
  char *string;
};

const object_class_t xstring_class = {
  .name = "string",
  .equal_fn = (object_equal_fn_t *) xstring_equal,
  .print_fn = (object_print_fn_t *) xstring_print,
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
  self->length = string_length(string);
  self->string = string_copy(string);
  record_insert_or_fail(static_xstring_record, string, self);
  return self;
}

xstring_t *make_xstring(char *string) {
  xstring_t *self = new(xstring_t);
  self->header.class = &xstring_class;
  self->length = string_length(string);
  self->string = string;
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

void xstring_free(xstring_t *self) {
  string_free(self->string);
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
  return lhs->length == rhs->length
    && string_equal(lhs->string, rhs->string);
}

void xstring_print(printer_t *printer, const xstring_t *self) {
  (void) printer;
  string_print("\"");
  string_print(self->string);
  string_print("\"");
}

hash_code_t xstring_hash_code(const xstring_t *self) {
  return string_hash_code(self->string);
}

ordering_t xstring_compare(const xstring_t *lhs, const xstring_t *rhs){
  return string_compare_lexical(lhs->string, rhs->string);
}

const char *xstring_string(const xstring_t *self) {
  return self->string;
}

size_t xstring_length(const xstring_t *self) {
  return self->length;
}

bool xstring_is_empty(const xstring_t *self) {
  return self->length == 0;
}

xstring_t *xstring_append(xstring_t *left, xstring_t *right) {
  return make_xstring(string_append(left->string, right->string));
}
