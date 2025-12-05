#include "index.h"

#define STACK_BLOCK_SIZE 64

stack_t *
make_stack(void) {
    stack_t *self = new(stack_t);
    self->array = make_array_auto();
    return self;
}

void
stack_purge(stack_t *self) {
    array_purge(self->array);
}

void
stack_free(stack_t *self) {
    stack_purge(self);
    array_free(self->array);
    free(self);
}

void
stack_put_free_fn(stack_t *self, free_fn_t *free_fn) {
    array_put_free_fn(self->array, free_fn);
}

stack_t *
make_stack_with(free_fn_t *free_fn) {
    stack_t *self = make_stack();
    stack_put_free_fn(self, free_fn);
    return self;
}

inline size_t
stack_length(const stack_t *self) {
    return array_length(self->array);
}

inline bool
stack_is_empty(const stack_t *self) {
    return array_is_empty(self->array);
}

inline void *
stack_top(stack_t *self) {
    return array_top(self->array);
}

inline void *
stack_pop(stack_t *self) {
    return array_pop(self->array);
}

inline void
stack_push(stack_t *self, void *value) {
    array_push(self->array, value);
}

inline void *
stack_get(const stack_t *self, size_t index) {
    return array_get(self->array, index);
}

inline void *
stack_pick(const stack_t *self, size_t index) {
    return array_pick(self->array, index);
}

inline void
stack_tuck_n(stack_t *self, void *target, size_t n) {
    list_t *value_list = make_list();
    for (size_t i = 0; i < n; i++) {
        void * value = stack_pop(self);
        assert(value);
        list_unshift(value_list, value);
    }

    stack_push(self, target);

    void *value = list_first(value_list);
    while (value) {
        stack_push(self, value);
        value = list_next(value_list);
    }

    list_free(value_list);
}
