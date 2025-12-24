#include "index.h"

struct array_t {
    size_t capacity;
    size_t mask;
    int64_t front;
    int64_t back;
    void **values;
    free_fn_t *free_fn;
};

array_t *
make_array(void) {
    array_t *self = new(array_t);
    size_t capacity = 32;
    self->capacity = capacity;
    self->mask = capacity - 1;
    self->front = 0;
    self->back = 0;
    self->values = allocate_pointers(capacity);
    return self;
}

void
array_purge(array_t *self) {
    assert(self);

    if (self->free_fn) {
        for (size_t i = 0; i < array_length(self); i++) {
            void *value = array_get(self, i);
            if (value) {
                self->free_fn(value);
                array_put(self, i, NULL);
            }
        }
    } else {
        memory_clear(self->values, self->capacity * sizeof(void *));
    }

    self->front = 0;
    self->back = 0;
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
make_array_with(free_fn_t *free_fn) {
    array_t *self = make_array();
    self->free_fn = free_fn;
    return self;
}

inline size_t
array_length(const array_t *self) {
    return self->back - self->front;
}

inline bool
array_is_empty(const array_t *self) {
    return self->back == self->front;
}

inline bool
array_is_full_capacity(const array_t *self) {
    return array_length(self) == self->capacity;
}

inline void
array_double_capacity(array_t *self) {
    void **values = allocate_pointers(self->capacity * 2);
    size_t length = array_length(self);
    for (size_t i = 0; i < length; i++) {
        values[i] = array_get(self, i);
    }

    free(self->values);
    self->values = values;
    self->capacity *= 2;
    self->mask = self->capacity - 1;
    self->front = 0;
    self->back = length;
}

inline void *
array_top(const array_t *self) {
    assert(!array_is_empty(self));
    return self->values[(self->back - 1) & self->mask];
}

inline void *
array_pop(array_t *self) {
    assert(!array_is_empty(self));
    self->back--;
    void *value = self->values[self->back & self->mask];
    self->values[self->back & self->mask] = NULL;
    return value;
}

inline void
array_push(array_t *self, void *value) {
    if (array_is_full_capacity(self)) {
        array_double_capacity(self);
    }

    self->values[self->back & self->mask] = value;
    self->back++;
}

inline void *
array_shift(array_t *self) {
    assert(!array_is_empty(self));
    void *value = self->values[self->front & self->mask];
    self->values[self->front & self->mask] = NULL;
    self->front++;
    return value;
}

inline void
array_unshift(array_t *self, void *value) {
    if (array_is_full_capacity(self)) {
        array_double_capacity(self);
    }

    self->front--;
    self->values[self->front & self->mask] = value;
}

inline void *
array_get(const array_t *self, size_t index) {
    if (index >= array_length(self))
        return NULL;

    return self->values[(self->front + index) & self->mask];
}

inline void *
array_pick(const array_t *self, size_t back_index) {
    assert(back_index < array_length(self));
    size_t index = array_length(self) - 1 - back_index;
    return array_get(self, index);
}

inline void
array_put(array_t *self, size_t index, void *value) {
    if (index >= self->capacity) {
        array_double_capacity(self);
        array_put(self, index, value);
        return;
    }

    self->values[(self->front + index) & self->mask] = value;

    if (index >= array_length(self))
        self->back += index + 1 - array_length(self);
}

void
array_reverse(array_t *self) {
    size_t length = array_length(self);
    for (size_t i = 0; i < length / 2; i++) {
        void *lhs = array_get(self, i);
        void *rhs = array_get(self, length - i - 1);
        array_put(self, i, rhs);
        array_put(self, length - i - 1, lhs);
    }
}
