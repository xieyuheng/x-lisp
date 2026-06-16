#pragma once

// a multiple producer multiple consumer
// thread safe double ended queue.

deque_t *make_deque(void);
void deque_free(deque_t *self);

size_t deque_length(deque_t *self);
bool deque_is_empty(deque_t *self);

void deque_push_front(deque_t *self, void *value);
void *deque_pop_front(deque_t *self);

void deque_push_back(deque_t *self, void *value);
void *deque_pop_back(deque_t *self);

// NOT thread safe
void *deque_get(const deque_t *self, size_t index);
