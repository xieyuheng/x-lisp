#pragma once

// stack implemented by growable array

struct stack_t {
    array_t *array;
};

stack_t *make_stack(void);
void stack_purge(stack_t *self);
void stack_free(stack_t *self);

void stack_put_free_fn(stack_t *self, free_fn_t *free_fn);
stack_t *make_stack_with(free_fn_t *free_fn);

size_t stack_length(const stack_t *self);
bool stack_is_empty(const stack_t *self);

void *stack_top(stack_t *self);
void *stack_pop(stack_t *self);
void stack_push(stack_t *self, void *value);

void *stack_get(const stack_t *self, size_t index);
void *stack_pick(const stack_t *self, size_t index);

void stack_tuck_n(stack_t *self, void *target, size_t n);
