#pragma once

record_t *make_record(void);
record_t *make_record_with(free_fn_t *free_fn);
record_t *make_string_record(void);

void record_purge(record_t *self);
void record_free(record_t *self);

void record_put_free_fn(record_t *self, free_fn_t *free_fn);

size_t record_length(const record_t *self);

bool record_has(record_t *self, const char *key);
void *record_get(record_t *self, const char *key);

// different from hash,
// insert and put does not own the `key` argument.

// - return true if success.
// - will not update the key if the entry exists (fail).
bool record_insert(record_t *self, const char *key, void *value);
void record_insert_or_fail(record_t *self, const char *key, void *value);

// - will always success.
// - auto free old value if there is `free_fn`.
void record_put(record_t *self, const char *key, void *value);

bool record_delete(record_t *self, const char *key);

// - iterate by insertion order.
void *record_first_value(record_t *self);
void *record_next_value(record_t *self);
