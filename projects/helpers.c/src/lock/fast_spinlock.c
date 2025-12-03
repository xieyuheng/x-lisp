#include "index.h"

fast_spinlock_t *
make_fast_spinlock(void) {
    fast_spinlock_t *self = new(fast_spinlock_t);
    atomic_init(&self->atomic_is_locked, false);
    return self;
}

void
fast_spinlock_free(fast_spinlock_t *self) {
    free(self);
}

void fast_spinlock_lock(fast_spinlock_t *self);
bool fast_spinlock_try_lock(fast_spinlock_t *self);
void fast_spinlock_unlock(fast_spinlock_t *self);
