#include "index.h"

array_t *
make_array(size_t capacity) {
    array_t *self = new(array_t);
    self->capacity = capacity;
    self->grow_step = capacity;
    self->cursor = 0;
    self->values = allocate_pointers(capacity);
    return self;
}

void
array_purge(array_t *self) {
    assert(self);

    if (self->free_fn) {
        for (size_t i = 0; i < self->capacity; i++) {
            void *value = array_get(self, i);
            if (value) {
                self->free_fn(value);
                array_put(self, i, NULL);
            }
        }
    } else {
        memory_clear(self->values, self->capacity * sizeof(void *));
    }

    self->cursor = 0;

}
void
array_free(array_t *self) {
    array_purge(self);
    free(self->values);
    free(self);
}

void
array_put_free_fn(array_t *self, free_fn_t *free_fn) {
    self->free_fn = free_fn;
}

array_t *
make_array_with(size_t capacity, free_fn_t *free_fn) {
    array_t *self = make_array(capacity);
    self->free_fn = free_fn;
    return self;
}

array_t *
make_array_auto(void) {
    return make_array(ARRAY_AUTO_SIZE);
}

array_t *
make_array_auto_with(free_fn_t *free_fn) {
    return make_array_with(ARRAY_AUTO_SIZE, free_fn);
}

size_t
array_capacity(const array_t *self) {
    return self->capacity;
}

inline size_t
array_grow_step(const array_t *self) {
    return self->grow_step;
}

inline void
array_put_grow_step(array_t *self, size_t grow_step) {
    self->grow_step = grow_step;
}

inline size_t
array_length(const array_t *self) {
    return self->cursor;
}

inline bool
array_is_empty(const array_t *self) {
    return self->cursor == 0;
}

inline bool
array_is_full(const array_t *self) {
    return self->cursor == self->capacity;
}

inline void
array_resize(array_t *self, size_t larger_size) {
    assert(larger_size >= self->capacity);
    if (larger_size == self->capacity) return;

    self->values = reallocate_pointers(self->values, self->capacity, larger_size);
    self->capacity = larger_size;
}

inline void *
array_top(array_t *self) {
    assert(self->cursor > 0);
    void *value = self->values[self->cursor - 1];
    return value;
}

inline void *
array_pop(array_t *self) {
    assert(self->cursor > 0);
    self->cursor--;
    void *value = self->values[self->cursor];
    self->values[self->cursor] = NULL;
    return value;
}

inline void
array_push(array_t *self, void *value) {
    if (array_is_full(self))
        array_resize(self, self->capacity + self->grow_step);

    self->values[self->cursor] = value;
    self->cursor++;
}

inline void *
array_get(const array_t *self, size_t index) {
    if (index >= self->capacity)
        return NULL;

    return self->values[index];
}

inline void *
array_pick(const array_t *self, size_t back_index) {
    assert(back_index < self->cursor);
    size_t index = self->cursor - 1 - back_index;
    return array_get(self, index);
}

inline void
array_put(array_t *self, size_t index, void *value) {
    if (index >= self->capacity)
        array_resize(self, index + self->grow_step);

    self->values[index] = value;

    if (index >= self->cursor)
        self->cursor = index + 1;
}
