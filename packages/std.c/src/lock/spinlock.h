#pragma once

spinlock_t *make_spinlock(void);
void spinlock_free(spinlock_t *self);

void spinlock_lock(spinlock_t *self);
bool spinlock_try_lock(spinlock_t *self);
void spinlock_unlock(spinlock_t *self);
