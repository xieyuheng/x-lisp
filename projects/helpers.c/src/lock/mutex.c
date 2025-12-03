#include "index.h"

mutex_t *
make_mutex(void) {
    mutex_t *self = new(mutex_t);
    pthread_mutexattr_t mutex_attr;
    pthread_mutexattr_init(&mutex_attr);
    pthread_mutexattr_settype(&mutex_attr, PTHREAD_MUTEX_ERRORCHECK);
    int errno = pthread_mutex_init(self, &mutex_attr);
    assert(errno == 0);
    pthread_mutexattr_destroy(&mutex_attr);
    return self;
}

void
mutex_free(mutex_t *self) {
    int errno = pthread_mutex_destroy(self);
    assert(errno == 0);
    free(self);
}

void
mutex_lock(mutex_t *self) {
    int errno = pthread_mutex_lock(self);
    assert(errno == 0);
}

bool
mutex_try_lock(mutex_t *self) {
    int errno = pthread_mutex_trylock(self);
    return errno == 0;
}

void mutex_unlock(mutex_t *self) {
    int errno = pthread_mutex_unlock(self);
    assert(errno == 0);
}
