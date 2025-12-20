#pragma once

gc_t *make_gc(void);
void gc_free(gc_t *self);

size_t gc_object_count(gc_t *self);
void gc_add_object(gc_t *self, object_t *object);
void gc_mark_object(gc_t *self, object_t *object);

void gc_mark(gc_t *self);
void gc_sweep(gc_t *self);
