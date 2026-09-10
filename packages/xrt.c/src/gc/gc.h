#pragma once

#include "deps.h"
#include "types.h"
#include "object.h"
#include "global_gc.h"
#include "../value/types.h"

typedef enum {
  GC_COLLECT_MINOR = 0,
  GC_COLLECT_MAJOR = 1,
} gc_collect_kind_t;

gc_t *make_gc(void);
void gc_free(gc_t *self);

size_t gc_object_count(gc_t *self);
size_t gc_young_count(gc_t *self);
size_t gc_old_count(gc_t *self);

void gc_add_object(gc_t *self, object_t *object);
void gc_remember(gc_t *self, object_t *object);

bool gc_should_collect(gc_t *self);
gc_collect_kind_t gc_collect(gc_t *self, array_t *roots);

void gc_report(gc_t *self);
void gc_print_stats(gc_t *self);

// - for measurement only: when true the write barrier is a no-op.
extern bool gc_barrier_disabled;
extern size_t gc_barrier_calls;

// - write barrier: call after storing `value` into a field of `container`.
// - only old -> young edges need to be remembered.
static inline void gc_write_barrier(object_t *container, value_t value) {
  gc_barrier_calls += 1;
  if (gc_barrier_disabled) return;
  if ((value & TAG_MASK) != X_OBJECT) return;
  if (container->header.is_static) return;
  if (container->header.generation != GC_OLD) return;

  object_t *child = (object_t *) (value & PAYLOAD_MASK);
  if (child->header.generation != GC_YOUNG) return;

  gc_remember(global_gc, container);
}
