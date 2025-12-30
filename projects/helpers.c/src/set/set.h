#pragma once

struct set_t {
    hash_t *hash;
};

set_t *make_set(void);
void set_free(set_t *self);

void set_put_hash_fn(set_t *self, hash_fn_t *hash_fn);
void set_put_free_fn(set_t *self, free_fn_t *free_fn);
void set_put_equal_fn(set_t *self, equal_fn_t *equal_fn);

set_t *make_put_with(free_fn_t *free_fn);
set_t *make_string_set(void);

size_t set_size(const set_t *self);
bool set_is_empty(const set_t *self);

// add successes if the value is not already exist.
bool set_add(set_t *self, void *value);

// put auto free old value if there is free_fn
void set_put(set_t *self, void *value);

bool set_member(set_t *self, void *value);

// return successful deleted or not.
bool set_delete(set_t *self, void *value);
