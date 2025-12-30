#pragma once

// double linked list.

list_t *make_list(void);
void list_free(list_t *self);
void list_purge(list_t *self);

void list_put_free_fn(list_t *self, free_fn_t *free_fn);
void list_put_equal_fn(list_t *self, equal_fn_t *equal_fn);
void list_put_copy_fn(list_t *self, copy_fn_t *copy_fn);

list_t *make_list_with(free_fn_t *free_fn);

// - values are copyed by `copy_fn` if exists.
// - will copy `equal_fn` if exists.
// - will NOT copy `free_fn`, otherwise there will be double-free.
list_t *list_copy(list_t *self);
list_t *list_copy_reversed(list_t *self);

size_t list_length(const list_t *self);
bool list_is_empty(const list_t *self);
bool list_member(const list_t *self, const void *value);
bool list_remove(list_t *self, const void *value);

// - searching from the start.
// - use `equal_fn` if exists, otherwise compare as pointer.
// - return the value found, or NULL.
void *list_find(list_t *self, const void *value);

const list_node_t *list_first_node(const list_t *self);
const list_node_t *list_last_node(const list_t *self);

void *list_first(const list_t *self);
void *list_last(const list_t *self);

void list_push(list_t *self, void *value);
void *list_pop(list_t *self);

void list_unshift(list_t *self, void *value);
void *list_shift(list_t *self);

void *list_get(const list_t *self, size_t index);

list_t *list_from_array(const array_t *array);
