#include "index.h"

mutex_t *make_mutex(void) {
  mutex_t *self = new(mutex_t);
  os_mutex_init(self);
  return self;
}

void mutex_free(mutex_t *self) {
  os_mutex_destroy(self);
  free(self);
}

void mutex_lock(mutex_t *self) {
  os_mutex_lock(self);
}

bool mutex_try_lock(mutex_t *self) {
  return os_mutex_try_lock(self);
}

void mutex_unlock(mutex_t *self) {
  os_mutex_unlock(self);
}
