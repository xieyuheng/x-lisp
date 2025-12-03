#pragma once

set_t *make_set(void);
void set_free(set_t *self);

void set_put_hash_fn(set_t *self, hash_fn_t *hash_fn);
void set_put_free_fn(set_t *self, free_fn_t *free_fn);
void set_put_equal_fn(set_t *self, equal_fn_t *equal_fn);

set_t *make_put_with(free_fn_t *free_fn);
set_t *string_make_set(void);

size_t set_length(const set_t *self);

// add successes if the value is not already exist.
bool set_add(set_t *self, void *value);

// put auto free old value if there is free_fn
void set_put(set_t *self, void *value);

bool set_has(set_t *self, void *value);

// return successful deleted or not.
bool set_delete(set_t *self, void *value);

void *set_first(set_t *self);
void *set_next(set_t *self);

list_t *set_to_list(set_t *self);
array_t *set_to_array(set_t *self);
