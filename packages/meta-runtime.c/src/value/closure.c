#include "index.h"

const object_class_t closure_class = {
  .name = "closure",
  .equal_fn = (object_equal_fn_t *) closure_equal,
  .write_fn = (object_write_fn_t *) closure_format,
  .free_fn = (free_fn_t *) closure_free,
  .make_child_iter_fn = (object_make_child_iter_fn_t *) make_closure_child_iter,
  .child_iter_next_fn = (object_child_iter_next_fn_t *) closure_child_iter_next,
  .child_iter_free_fn = (free_fn_t *) closure_child_iter_free,
};

closure_t *make_closure(definition_t *definition, size_t size) {
  closure_t *self = new(closure_t);
  self->header.class = &closure_class;
  self->definition = definition;
  self->size = size;
  self->args = allocate_pointers(size);
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

void closure_free(closure_t *self) {
  free(self->args);
  free(self);
}

bool closure_p(value_t value) {
  return object_p(value) &&
    to_object(value)->header.class == &closure_class;
}

closure_t *to_closure(value_t value) {
  assert(closure_p(value));
  return (closure_t *) to_object(value);
}

bool closure_equal(const closure_t *lhs, const closure_t *rhs) {
  if (lhs->definition != rhs->definition) return false;
  if (lhs->size != rhs->size) return false;
  if (lhs->args == rhs->args) return true;

  for (size_t i = 0; i < lhs->size; i++) {
    if (!equal_p(lhs->args[i], rhs->args[i])) return false;
  }

  return true;
}

void closure_format(buffer_t *buffer, object_circle_ctx_t *ctx, const closure_t *self) {
  write_template(buffer, "(@closure ");
  value_format(buffer, ctx, x_object(self->definition));
  write_template(buffer, " [");
  for (size_t i = 0; i < self->size; i++) {
    if (i > 0) write_template(buffer, " ");
    value_format(buffer, ctx, self->args[i]);
  }
  write_template(buffer, "]");
  write_template(buffer, ")");
}

struct closure_child_iter_t {
  const closure_t *closure;
  bool definition_consumed_p;
  size_t index;
};

closure_child_iter_t *make_closure_child_iter(const closure_t *closure) {
  closure_child_iter_t *self = new(closure_child_iter_t);
  self->closure = closure;
  self->definition_consumed_p = false;
  self->index = 0;
  return self;
}

void closure_child_iter_free(closure_child_iter_t *self) {
  free(self);
}

object_t *closure_child_iter_next(closure_child_iter_t *iter) {
  if (!iter->definition_consumed_p) {
    iter->definition_consumed_p = true;
    return (object_t *) iter->closure->definition;
  }

  if (iter->index < iter->closure->size) {
    value_t value = iter->closure->args[iter->index++];
    return object_p(value)
      ? to_object(value)
      : closure_child_iter_next(iter);
  }

  return NULL;
}
