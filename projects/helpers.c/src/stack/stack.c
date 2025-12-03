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

size_t stack_length(const stack_t *self);
bool stack_is_empty(const stack_t *self);

void *stack_top(stack_t *self);
void *stack_pop(stack_t *self);
void stack_push(stack_t *self, void *value);

void *stack_get(const stack_t *self, size_t index);
void *stack_pick(const stack_t *self, size_t index);

void stack_tuck_n(stack_t *self, void *target, size_t n);
