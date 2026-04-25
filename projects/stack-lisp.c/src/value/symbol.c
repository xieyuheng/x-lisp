#include "index.h"

struct symbol_t {
  struct object_header_t header;
  char *string;
};

const object_class_t symbol_class = {
  .name = "symbol",
  .format_fn = (object_format_fn_t *) symbol_format,
  .hash_code_fn = (object_hash_code_fn_t *) symbol_hash_code,
  .compare_fn = (object_compare_fn_t *) symbol_compare,
};

static record_t *static_symbol_record = NULL;

symbol_t *intern_symbol(const char *string) {
  if (!static_symbol_record) {
    static_symbol_record = make_record();
  }

  symbol_t *found = record_get(static_symbol_record, string);
  if (found) {
    return found;
  }

  symbol_t *self = new(symbol_t);
  self->header.class = &symbol_class;
  self->header.is_static = true;
  self->string = string_copy(string);
  record_insert_or_fail(static_symbol_record, string, self);
  return self;
}

void symbol_free(symbol_t *self) {
  string_free(self->string);
  free(self);
}

const char *symbol_string(const symbol_t *self) {
  return self->string;
}

size_t symbol_length(const symbol_t *self) {
  return string_length(self->string);
}

bool symbol_p(value_t value) {
  return object_p(value) &&
    to_object(value)->header.class == &symbol_class;
}

symbol_t *to_symbol(value_t value) {
  assert(symbol_p(value));
  return (symbol_t *) to_object(value);
}


void symbol_format(buffer_t *buffer, object_circle_ctx_t *ctx, const symbol_t *self) {
  (void) ctx;
  buffer_append_string(buffer, "'");
  buffer_append_string(buffer, symbol_string(self));
}

hash_code_t symbol_hash_code(const symbol_t *self) {
  return 3 * string_hash_code(self->string);
}

ordering_t symbol_compare(const symbol_t *lhs, const symbol_t *rhs) {
  return string_compare_lexical(lhs->string, rhs->string);
}
