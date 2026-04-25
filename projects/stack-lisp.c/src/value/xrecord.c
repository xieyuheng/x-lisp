#include "index.h"

const object_class_t xrecord_class = {
  .name = "record",
  .equal_fn = (object_equal_fn_t *) xrecord_equal,
  .print_fn = (object_print_fn_t *) xrecord_print,
  .hash_code_fn = (object_hash_code_fn_t *) xrecord_hash_code,
  .compare_fn = (object_compare_fn_t *) xrecord_compare,
  .free_fn = (free_fn_t *) xrecord_free,
  .make_child_iter_fn = (object_make_child_iter_fn_t *) make_xrecord_child_iter,
  .child_iter_next_fn = (object_child_iter_next_fn_t *) xrecord_child_iter_next,
  .child_iter_free_fn = (free_fn_t *) xrecord_child_iter_free,
};

xrecord_t *make_xrecord(void) {
  xrecord_t *self = new(xrecord_t);
  self->header.class = &xrecord_class;
  self->attributes = make_record();
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

void xrecord_free(xrecord_t *self) {
  record_free(self->attributes);
  free(self);
}

bool xrecord_p(value_t value) {
  return object_p(value) &&
    to_object(value)->header.class == &xrecord_class;
}

xrecord_t *to_xrecord(value_t value) {
  if (!xrecord_p(value)) {
    print(value);
    newline();
  }

  assert(xrecord_p(value));
  return (xrecord_t *) to_object(value);
}

inline bool xrecord_has(const xrecord_t *self, const char *key) {
  return record_has(self->attributes, key);
}

inline value_t xrecord_get(const xrecord_t *self, const char *key) {
  hash_entry_t *entry = record_get_entry(self->attributes, key);
  assert(entry);
  return (value_t) entry->value;
}

inline void xrecord_put(xrecord_t *self, const char *key, value_t value) {
  record_put(self->attributes, key, (void *) value);
}

inline void xrecord_delete(xrecord_t *self, const char *key) {
  record_delete(self->attributes, key);
}

xrecord_t *xrecord_copy(const xrecord_t *self) {
  xrecord_t *new_xrecord = make_xrecord();

  record_iter_t iter;
  record_iter_init(&iter, self->attributes);
  const hash_entry_t *entry = record_iter_next_entry(&iter);
  while (entry) {
    xrecord_put(new_xrecord, entry->key, (value_t) entry->value);
    entry = record_iter_next_entry(&iter);
  }

  return new_xrecord;
}

bool xrecord_equal(const xrecord_t *lhs, const xrecord_t *rhs) {
  if (record_length(lhs->attributes) != record_length(rhs->attributes))
    return false;

  record_iter_t iter;
  record_iter_init(&iter, lhs->attributes);
  const char *key = record_iter_next_key(&iter);
  while (key) {
    value_t left = xrecord_get(lhs, key);
    value_t right = xrecord_get(rhs, key);
    if (!equal_p(left, right))
      return false;

    key = record_iter_next_key(&iter);
  }

  return true;
}

static void xrecord_print_attributes(object_circle_ctx_t *ctx, const xrecord_t *self) {
  record_iter_t iter;
  record_iter_init(&iter, self->attributes);

  const char *key = record_iter_next_key(&iter);

  // no leading space for the first attribute
  if (key) {
    value_t value = xrecord_get(self, key);
    printf(":%s ", key);
    value_print(ctx, value);
    key = record_iter_next_key(&iter);
  }

  while (key) {
    value_t value = xrecord_get(self, key);
    printf(" :%s ", key);
    value_print(ctx, value);
    key = record_iter_next_key(&iter);
  }
}

void xrecord_print(object_circle_ctx_t *ctx, const xrecord_t *self) {
  if (record_is_empty(self->attributes)) {
    printf("{");
    printf("}");
  } else {
    printf("{");
    xrecord_print_attributes(ctx, self);
    printf("}");
  }
}

static ordering_t compare_hash_entry(const hash_entry_t *lhs, const hash_entry_t *rhs) {
  return string_compare_lexical(lhs->key, rhs->key);
}

hash_code_t xrecord_hash_code(const xrecord_t *self) {
  hash_code_t code = 6661; // any big prime number would do.

  array_t *entries = record_entries(self->attributes);
  array_sort(entries, (compare_fn_t *) compare_hash_entry);
  for (size_t i = 0; i < array_length(entries); i++) {
    const hash_entry_t *entry = array_get(entries, i);
    const char *key = entry->key;
    value_t value = (value_t) entry->value;
    code = (code << 5) + code + string_hash_code(key);
    code = (code << 5) - code + value_hash_code(value);
  }

  array_free(entries);
  return code;
}

static ordering_t compare_attribute_entry(const hash_entry_t *lhs, const hash_entry_t *rhs) {
  ordering_t ordering = string_compare_lexical(lhs->key, rhs->key);
  if (ordering != 0) {
    return ordering;
  }

  return value_total_compare((value_t) lhs->value, (value_t) rhs->value);
}

static ordering_t xrecord_compare_attributes(const xrecord_t *lhs, const xrecord_t *rhs) {
  array_t *lhs_entries = record_entries(lhs->attributes);
  array_t *rhs_entries = record_entries(rhs->attributes);
  array_sort(lhs_entries, (compare_fn_t *) compare_attribute_entry);
  array_sort(rhs_entries, (compare_fn_t *) compare_attribute_entry);
  size_t lhs_length = array_length(lhs_entries);
  size_t rhs_length = array_length(rhs_entries);

  size_t i = 0;
  ordering_t ordering;
  while (true) {
    if (i == lhs_length && i == rhs_length) {
      ordering = 0;
      break;
    }

    if (i == lhs_length) {
      ordering = -1;
      break;
    }

    if (i == rhs_length) {
      ordering = 1;
      break;
    }

    ordering = compare_attribute_entry(
      array_get(lhs_entries, i),
      array_get(rhs_entries, i));
    if (ordering != 0) {
      break;
    }

    i++;
  }

  array_free(lhs_entries);
  array_free(rhs_entries);
  return ordering;
}

ordering_t xrecord_compare(const xrecord_t *lhs, const xrecord_t *rhs) {
  return xrecord_compare_attributes(lhs, rhs);
}

struct xrecord_child_iter_t {
  const xrecord_t *xrecord;
  size_t index;
  struct record_iter_t record_iter;
};

xrecord_child_iter_t *make_xrecord_child_iter(const xrecord_t *xrecord) {
  xrecord_child_iter_t *self = new(xrecord_child_iter_t);
  self->xrecord = xrecord;
  self->index = 0;
  record_iter_init(&self->record_iter, xrecord->attributes);
  return self;
}

void xrecord_child_iter_free(xrecord_child_iter_t *self) {
  free(self);
}

object_t *xrecord_child_iter_next(xrecord_child_iter_t *iter) {
  const hash_entry_t *entry = record_iter_next_entry(&iter->record_iter);
  if (entry) {
    value_t value = (value_t) entry->value;
    return object_p(value)
      ? to_object(value)
      : xrecord_child_iter_next(iter);
  }

  return NULL;
}
