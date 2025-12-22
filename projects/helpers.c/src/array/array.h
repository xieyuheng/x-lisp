#pragma once

struct array_t {
    size_t capacity;
    size_t grow_step;
    size_t cursor;
    void **values;
    free_fn_t *free_fn;
};

// growable array

array_t *make_array(size_t capacity);
void array_purge(array_t *self);
void array_free(array_t *self);

void array_put_free_fn(array_t *self, free_fn_t *free_fn);
array_t *make_array_with(size_t capacity, free_fn_t *free_fn);

array_t *make_array_auto(void);
array_t *make_array_auto_with(free_fn_t *free_fn);

size_t array_length(const array_t *self);
bool array_is_empty(const array_t *self);

void *array_top(array_t *self);
void *array_pop(array_t *self);
void array_push(array_t *self, void *value);

void *array_get(const array_t *self, size_t index);
void *array_pick(const array_t *self, size_t back_index);

void array_put(array_t *self, size_t index, void *value);
