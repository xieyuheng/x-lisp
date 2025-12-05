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

inline void
fast_spinlock_lock(fast_spinlock_t *self) {
    while (atomic_load_explicit(
               &self->atomic_is_locked,
               memory_order_relaxed) ||
           atomic_exchange_explicit(
               &self->atomic_is_locked,
               true,
               memory_order_acquire))
    {
        time_sleep_nanosecond(1);
    }
}

inline bool
fast_spinlock_try_lock(fast_spinlock_t *self) {
    return !(atomic_load_explicit(
                 &self->atomic_is_locked,
                 memory_order_relaxed) ||
             atomic_exchange_explicit(
                 &self->atomic_is_locked,
                 true,
                 memory_order_acquire));
}

inline void
fast_spinlock_unlock(fast_spinlock_t *self) {
    atomic_store_explicit(
        &self->atomic_is_locked,
        false,
        memory_order_release);
}
