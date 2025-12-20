#pragma once

gc_t *make_gc(void);
void gc_free(gc_t *self);

void gc_add_root(gc_t *self, object_t *root);

void gc_mark(gc_t *self);
void gc_sweep(gc_t *self);
