#pragma once

hash_t *make_hash(void);
void hash_purge(hash_t *self);
void hash_free(hash_t *self);

void hash_put_hash_fn(hash_t *self, hash_fn_t *hash_fn);
void hash_put_key_free_fn(hash_t *self, free_fn_t *key_free_fn);
void hash_put_key_equal_fn(hash_t *self, equal_fn_t *key_equal_fn);
void hash_put_value_free_fn(hash_t *self, free_fn_t *value_free_fn);

hash_t *make_hash_with_string_keys(void);

size_t hash_length(const hash_t *self);

bool hash_has(hash_t *self, const void *key);
void *hash_get(hash_t *self, const void *key);

// return true if success.
// will own the key if success.
// will not update the key if the entry exists (fail).
bool hash_insert(hash_t *self, void *key, void *value);
void hash_insert_or_fail(hash_t *self, void *key, void *value);


// will always success.
// will own the key.
// auto free old key if there is `key_free_fn`.
// auto free old value if there is `value_free_fn`.
void hash_put(hash_t *self, void *key, void *value);

bool hash_delete(hash_t *self, const void *key);

void *hash_first(hash_t *self);
void *hash_next(hash_t *self);
void *hash_cursor(hash_t *self);

list_t *hash_value_list(hash_t *self);

void hash_report(const hash_t *self);
