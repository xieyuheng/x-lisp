#include "index.h"

const object_class_t xhash_class = {
  .name = "hash",
  .equal_fn = (object_equal_fn_t *) xhash_equal,
  .write_fn = (object_write_fn_t *) write_xhash,
  .hash_code_fn = (object_hash_code_fn_t *) xhash_hash_code,
  .compare_fn = (object_compare_fn_t *) xhash_compare,
  .free_fn = (free_fn_t *) xhash_free,
  .for_each_child_fn = (object_for_each_child_fn_t *) xhash_for_each_child,
};

static hash_code_t value_hash_fn(const void *key) {
  return value_hash_code((value_t) key);
}

static bool value_equal_fn(const void *lhs, const void *rhs) {
  return equal((value_t) lhs, (value_t) rhs);
}

xhash_t *make_xhash(void) {
  xhash_t *self = new(xhash_t);
  self->header.class = &xhash_class;
  self->hash = make_hash();
  hash_put_hash_fn(self->hash, (hash_fn_t *) value_hash_fn);
  hash_put_key_equal_fn(self->hash, (equal_fn_t *) value_equal_fn);
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

void xhash_free(xhash_t *self) {
  hash_free(self->hash);
  free(self);
}

bool is_xhash(value_t value) {
  return is_object(value) &&
    to_object(value)->header.class == &xhash_class;
}

xhash_t *to_xhash(value_t value) {
  assert(is_xhash(value));
  return (xhash_t *) to_object(value);
}

size_t xhash_length(const xhash_t *self) {
  return hash_length(self->hash);
}

bool xhash_is_empty(const xhash_t *self) {
  return hash_is_empty(self->hash);
}

inline bool xhash_has(const xhash_t *self, value_t key) {
  return hash_has(self->hash, (void *) key);
}

inline value_t xhash_get(const xhash_t *self, value_t key) {
  hash_entry_t *entry = hash_get_entry(self->hash, (void *) key);
  if (!entry) {
    who_printf("undefined key: ");
    print_value(key, LANG_EN);
    printf("\n");
    exit(1);
  }

  return (value_t) entry->value;
}

inline void xhash_put(xhash_t *self, value_t key, value_t value) {
  hash_put(self->hash, (void *) key, (void *) value);
  gc_write_barrier((object_t *) self, key);
  gc_write_barrier((object_t *) self, value);
}

inline void xhash_delete(xhash_t *self, value_t key) {
  hash_delete(self->hash, (void *) key);
}

xhash_t *xhash_copy(const xhash_t *self) {
  xhash_t *new_hash = make_xhash();
  hash_iter_t iter;
  hash_iter_init(&iter, self->hash);
  const hash_entry_t *entry = hash_iter_next_entry(&iter);
  while (entry) {
    xhash_put(new_hash, (value_t) entry->key, (value_t) entry->value);
    entry = hash_iter_next_entry(&iter);
  }

  return new_hash;
}

bool xhash_equal(const xhash_t *lhs, const xhash_t *rhs) {
  if (hash_length(lhs->hash) != hash_length(rhs->hash))
    return false;

  hash_iter_t iter;
  hash_iter_init(&iter, lhs->hash);
  value_t key = (value_t) hash_iter_next_key(&iter);
  while (key) {
    value_t left = xhash_get(lhs, key);
    value_t right = xhash_get(rhs, key);
    if (!equal(left, right))
      return false;

    key = (value_t) hash_iter_next_key(&iter);
  }

  return true;
}

static void write_xhash_entries(buffer_t *buffer, object_circle_ctx_t *ctx, const xhash_t *self) {
  hash_iter_t iter;
  hash_iter_init(&iter, self->hash);

  value_t key = (value_t) hash_iter_next_key(&iter);
  while (key) {
    value_t value = xhash_get(self, key);
    write_template(buffer, " ");
    write_value_in_ctx(buffer, ctx, key);
    write_template(buffer, " ");
    write_value_in_ctx(buffer, ctx, value);
    key = (value_t) hash_iter_next_key(&iter);
  }
}

void write_xhash(buffer_t *buffer, object_circle_ctx_t *ctx, const xhash_t *self) {
  write_template(buffer, ctx->lang == LANG_ZH ? "(@散列" : "(@hash");
  write_xhash_entries(buffer, ctx, self);
  write_template(buffer, ")");
}

static ordering_t compare_hash_entry(const hash_entry_t *lhs, const hash_entry_t *rhs) {
  ordering_t ordering =
    value_total_compare((value_t) lhs->key, (value_t) rhs->key);
  if (ordering != 0) {
    return ordering;
  }

  return value_total_compare((value_t) lhs->value, (value_t) rhs->value);
}

hash_code_t xhash_hash_code(const xhash_t *self) {
  hash_code_t code = 7001; // any big prime number would do.

  array_t *entries = hash_entries(self->hash);
  array_sort(entries, (compare_fn_t *) compare_hash_entry);
  for (size_t i = 0; i < array_length(entries); i++) {
    const hash_entry_t *entry = array_get(entries, i);
    value_t key = (value_t) entry->key;
    value_t value = (value_t) entry->value;
    code = (code << 5) + code + value_hash_code(key);
    code = (code << 5) - code + value_hash_code(value);
  }

  array_free(entries);
  return code;
}

ordering_t xhash_compare(const xhash_t *lhs, const xhash_t *rhs) {
  array_t *lhs_entries = hash_entries(lhs->hash);
  array_t *rhs_entries = hash_entries(rhs->hash);
  array_sort(lhs_entries, (compare_fn_t *) compare_hash_entry);
  array_sort(rhs_entries, (compare_fn_t *) compare_hash_entry);
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

    ordering = compare_hash_entry(
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

void xhash_for_each_child(const xhash_t *hash,
                          object_visit_child_fn_t *visit, void *ctx) {
  hash_iter_t iter;
  hash_iter_init(&iter, hash->hash);
  const hash_entry_t *entry = hash_iter_next_entry(&iter);
  while (entry) {
    value_t key = (value_t) entry->key;
    if (is_object(key)) visit(to_object(key), ctx);
    value_t value = (value_t) entry->value;
    if (is_object(value)) visit(to_object(value), ctx);
    entry = hash_iter_next_entry(&iter);
  }
}
