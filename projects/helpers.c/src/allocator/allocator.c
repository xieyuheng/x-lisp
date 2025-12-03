#include "index.h"

allocator_t *
make_allocator(size_t cache_size) {
    allocator_t *self = new_page_aligned(allocator_t);
    self->mutex = make_mutex();
    self->stack = make_stack();
    self->cache_size = cache_size;
    return self;
}

void
allocator_free(allocator_t *self) {
    mutex_free(self->mutex);
    stack_free(self->stack);
    free(self);
}

void *
allocator_maybe_allocate(allocator_t *self, stack_t *stack) {
    if (stack_is_empty(stack)) {
        mutex_lock(self->mutex);

        for (size_t i = 0; i < self->cache_size; i++) {
            if (stack_is_empty(self->stack)) break;
            stack_push(stack, stack_pop(self->stack));
        }

        mutex_unlock(self->mutex);
    }

    if (stack_is_empty(stack)) {
        return NULL;
    }

    return stack_pop(stack);
}

void *
allocator_allocate(allocator_t *self, stack_t *stack) {
    void *value = allocator_maybe_allocate(self, stack);

    if (!value) {
        who_printf("not enough value\n");
        exit(1);
    }

    return value;
}

void
allocator_recycle(allocator_t *self, stack_t *stack, void *value) {
    if (stack_length(stack) >= 2 * self->cache_size) {
        mutex_lock(self->mutex);

        for (size_t i = 0; i < self->cache_size; i++) {
            stack_push(self->stack, stack_pop(stack));
        }

        mutex_unlock(self->mutex);
    }

    stack_push(stack, value);
}
