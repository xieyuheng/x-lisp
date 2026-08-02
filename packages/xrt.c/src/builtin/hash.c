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
  xlist_t *keys = make_xlist();

  hash_iter_t iter;
  hash_iter_init(&iter, to_xhash(hash)->hash);
  const hash_entry_t *entry = hash_iter_next_entry(&iter);
  while (entry) {
    xlist_push(keys, (value_t) entry->key);
    entry = hash_iter_next_entry(&iter);
  }

  return x_object(keys);
}

value_t x_hash_values(value_t hash) {
  xlist_t *keys = make_xlist();

  hash_iter_t iter;
  hash_iter_init(&iter, to_xhash(hash)->hash);
  const hash_entry_t *entry = hash_iter_next_entry(&iter);
  while (entry) {
    xlist_push(keys, (value_t) entry->value);
    entry = hash_iter_next_entry(&iter);
  }

  return x_object(keys);
}

value_t x_hash_entries(value_t hash) {
  xlist_t *entries = make_xlist();

  hash_iter_t iter;
  hash_iter_init(&iter, to_xhash(hash)->hash);
  const hash_entry_t *entry = hash_iter_next_entry(&iter);
  value_t tag = x_object(intern_symbol("make-hash-entry"));
  while (entry) {
    value_t key = (value_t) entry->key;
    value_t value = (value_t) entry->value;
    xlist_t *data = make_xlist();
    xlist_push(data, tag);
    xlist_push(data, key);
    xlist_push(data, value);
    xlist_push(entries, x_object(data));
    entry = hash_iter_next_entry(&iter);
  }

  return x_object(entries);
}

value_t x_hash_entries_zh(value_t hash) {
  xlist_t *entries = make_xlist();

  hash_iter_t iter;
  hash_iter_init(&iter, to_xhash(hash)->hash);
  const hash_entry_t *entry = hash_iter_next_entry(&iter);
  value_t tag = x_object(intern_symbol("作散列条目"));
  while (entry) {
    value_t key = (value_t) entry->key;
    value_t value = (value_t) entry->value;
    xlist_t *data = make_xlist();
    xlist_push(data, tag);
    xlist_push(data, key);
    xlist_push(data, value);
    xlist_push(entries, x_object(data));
    entry = hash_iter_next_entry(&iter);
  }

  return x_object(entries);
}
