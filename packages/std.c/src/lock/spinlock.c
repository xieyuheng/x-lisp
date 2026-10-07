#include "index.h"

spinlock_t *make_spinlock(void) {
  spinlock_t *self = new(spinlock_t);
  os_spinlock_init(self);
  return self;
}

void spinlock_free(spinlock_t *self) {
  os_spinlock_destroy(self);
  // We need to cast pointer to volatile data to normal pointer.
  free((void *) self);
}

void spinlock_lock(spinlock_t *self) {
  os_spinlock_lock(self);
}

bool spinlock_try_lock(spinlock_t *self) {
  return os_spinlock_try_lock(self);
}

void spinlock_unlock(spinlock_t *self) {
  os_spinlock_unlock(self);
}
