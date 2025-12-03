#include "index.h"

spinlock_t *
make_spinlock(void) {
    spinlock_t *self = new(spinlock_t);
    int errno = pthread_spin_init(self, PTHREAD_PROCESS_PRIVATE);
    assert(errno == 0);
    return self;
}

void
spinlock_free(spinlock_t *self) {
    int errno = pthread_spin_destroy(self);
    assert(errno == 0);
    // We need to cast pointer to volatile data to normal pointer.
    free((void *) self);
}

void
spinlock_lock(spinlock_t *self) {
    int errno = pthread_spin_lock(self);
    assert(errno == 0);
}

bool
spinlock_try_lock(spinlock_t *self) {
    int errno = pthread_spin_trylock(self);
    return errno == 0;
}

void spinlock_unlock(spinlock_t *self) {
    int errno = pthread_spin_unlock(self);
    assert(errno == 0);
}
