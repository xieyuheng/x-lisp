#pragma once

// array implemented by growable circular buffer

array_t *make_array(void);
void array_purge(array_t *self);
void array_free(array_t *self);

void array_put_free_fn(array_t *self, free_fn_t *free_fn);
array_t *make_array_with(free_fn_t *free_fn);

size_t array_length(const array_t *self);
bool array_is_empty(const array_t *self);
bool array_is_full_capacity(const array_t *self);
void array_double_capacity(array_t *self);

void *array_top(const array_t *self);
void *array_pop(array_t *self);
void array_push(array_t *self, void *value);

void *array_shift(array_t *self);
void array_unshift(array_t *self, void *value);

void *array_get(const array_t *self, size_t index);
void *array_pick(const array_t *self, size_t back_index);
void array_put(array_t *self, size_t index, void *value);

void array_reverse(array_t *self);
void array_swap(array_t *array, size_t left, size_t right);
