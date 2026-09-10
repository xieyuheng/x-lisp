#include "index.h"

value_t x_make_hash(void) {
  return x_object(make_xhash());
}

value_t x_is_any_hash(value_t value) {
  return x_bool(is_xhash(value));
}

value_t x_hash_copy(value_t hash) {
  return x_object(xhash_copy(to_xhash(hash)));
}

value_t x_hash_length(value_t hash) {
  return x_int(xhash_length(to_xhash(hash)));
}

value_t x_hash_is_empty(value_t hash) {
  return x_bool(xhash_is_empty(to_xhash(hash)));
}

value_t x_hash_get(value_t key, value_t hash) {
  return xhash_get(to_xhash(hash), key);
}

value_t x_hash_has(value_t key, value_t hash) {
  return x_bool(xhash_has(to_xhash(hash), key));
}

value_t x_hash_put_mut(value_t key, value_t value, value_t hash) {
  xhash_put(to_xhash(hash), key, value);
  return x_void;
}

value_t x_hash_put(value_t key, value_t value, value_t hash) {
  value_t copy = x_hash_copy(hash);
  xhash_put(to_xhash(copy), key, value);
  return copy;
}

value_t x_hash_delete_mut(value_t key, value_t hash) {
  xhash_delete(to_xhash(hash), key);
  return x_void;
}

value_t x_hash_delete(value_t key, value_t hash) {
  value_t copy = x_hash_copy(hash);
  xhash_delete(to_xhash(copy), key);
  return copy;
}

value_t x_hash_keys(value_t hash) {
  list_builder_t keys = list_builder_empty();

  hash_iter_t iter;
  hash_iter_init(&iter, to_xhash(hash)->hash);
  const hash_entry_t *entry = hash_iter_next_entry(&iter);
  while (entry) {
    list_builder_append(&keys, (value_t) entry->key);
    entry = hash_iter_next_entry(&iter);
  }

  return list_builder_result(&keys);
}

value_t x_hash_values(value_t hash) {
  list_builder_t values = list_builder_empty();

  hash_iter_t iter;
  hash_iter_init(&iter, to_xhash(hash)->hash);
  const hash_entry_t *entry = hash_iter_next_entry(&iter);
  while (entry) {
    list_builder_append(&values, (value_t) entry->value);
    entry = hash_iter_next_entry(&iter);
  }

  return list_builder_result(&values);
}

value_t x_hash_entries(value_t hash) {
  list_builder_t entries = list_builder_empty();

  hash_iter_t iter;
  hash_iter_init(&iter, to_xhash(hash)->hash);
  const hash_entry_t *entry = hash_iter_next_entry(&iter);
  while (entry) {
    value_t key = (value_t) entry->key;
    value_t value = (value_t) entry->value;
    list_builder_append(&entries, x_make_pair(key, value));
    entry = hash_iter_next_entry(&iter);
  }

  return list_builder_result(&entries);
}
