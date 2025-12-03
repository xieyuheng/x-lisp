#include "index.h"

// TODO just use list + lock for now

struct deque_t {
    fast_spinlock_t *fast_spinlock;
    list_t *list;
};

deque_t *
make_deque(void) {
    deque_t *self = new(deque_t);
    self->fast_spinlock = make_fast_spinlock();
    self->list = make_list();
    return self;
}

void
deque_free(deque_t *self) {
    fast_spinlock_free(self->fast_spinlock);
    list_free(self->list);
    free(self);
}

size_t
deque_length(deque_t *self) {
    fast_spinlock_lock(self->fast_spinlock);
    size_t length = list_length(self->list);
    fast_spinlock_unlock(self->fast_spinlock);
    return length;
}

bool
deque_is_empty(deque_t *self) {
    fast_spinlock_lock(self->fast_spinlock);
    bool is_empty = list_is_empty(self->list);
    fast_spinlock_unlock(self->fast_spinlock);
    return is_empty;
}

void
deque_push_front(deque_t *self, void *value) {
    fast_spinlock_lock(self->fast_spinlock);
    list_unshift(self->list, value);
    fast_spinlock_unlock(self->fast_spinlock);
}

void *
deque_pop_front(deque_t *self) {
    fast_spinlock_lock(self->fast_spinlock);
    void *value = list_shift(self->list);
    fast_spinlock_unlock(self->fast_spinlock);
    return value;
}

void
deque_push_back(deque_t *self, void *value) {
    fast_spinlock_lock(self->fast_spinlock);
    list_push(self->list, value);
    fast_spinlock_unlock(self->fast_spinlock);
}

void *deque_pop_back(deque_t *self) {
    fast_spinlock_lock(self->fast_spinlock);
    void *value = list_pop(self->list);
    fast_spinlock_unlock(self->fast_spinlock);
    return value;
}

void *
deque_get(const deque_t *self, size_t index) {
    fast_spinlock_lock(self->fast_spinlock);
    void *value = list_get(self->list, index);
    fast_spinlock_unlock(self->fast_spinlock);
    return value;
}
