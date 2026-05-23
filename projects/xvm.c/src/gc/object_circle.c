#include "index.h"

object_circle_ctx_t *make_object_circle_ctx(void) {
  object_circle_ctx_t *self = new(object_circle_ctx_t);
  self->occurred_objects = make_set();
  self->circle_indexes = make_hash();
  return self;
}

void object_circle_ctx_free(object_circle_ctx_t *self) {
  set_free(self->occurred_objects);
  hash_free(self->circle_indexes);
  free(self);
}

bool object_circle_start_p(object_circle_ctx_t *self, object_t *object) {
  return hash_has(self->circle_indexes, object)
    && !set_member(self->occurred_objects, object);
}

bool object_circle_end_p(object_circle_ctx_t *self, object_t *object) {
  return hash_has(self->circle_indexes, object)
    && set_member(self->occurred_objects, object);
}

size_t object_circle_index(object_circle_ctx_t *self, object_t *object) {
  return (size_t) hash_get(self->circle_indexes, object);
}

void object_circle_meet(object_circle_ctx_t *self, object_t *object) {
  set_add(self->occurred_objects, object);
}

void object_circle_collect(object_circle_ctx_t *self, object_t *object) {
  if (set_member(self->occurred_objects, object)) {
    if (hash_has(self->circle_indexes, object)) return;

    size_t index = hash_length(self->circle_indexes);
    hash_put(self->circle_indexes, object, (void *) index);
    return;
  }

  const object_class_t *class = object->header.class;
  if (class->make_child_iter_fn) {
    set_add(self->occurred_objects, object);

    void *iter = class->make_child_iter_fn(object);
    object_t *child = class->child_iter_next_fn(iter);
    while (child) {
      object_circle_collect(self, child);
      child = class->child_iter_next_fn(iter);
    }

    class->child_iter_free_fn(iter);
  }
}
