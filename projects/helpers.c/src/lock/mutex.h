#pragma once

mutex_t *make_mutex(void);
void mutex_free(mutex_t *self);

void mutex_lock(mutex_t *self);
bool mutex_try_lock(mutex_t *self);
void mutex_unlock(mutex_t *self);
