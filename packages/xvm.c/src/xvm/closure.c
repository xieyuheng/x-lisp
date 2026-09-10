#include "index.h"

const object_class_t closure_class = {
  .name = "closure",
  .equal_fn = (object_equal_fn_t *) closure_equal,
  .write_fn = (object_write_fn_t *) write_closure,
  .free_fn = (free_fn_t *) closure_free,
  .for_each_child_fn = (object_for_each_child_fn_t *) closure_for_each_child,
};

closure_t *make_closure(function_t *function, size_t size) {
  closure_t *self = new(closure_t);
  self->header.class = &closure_class;
  self->function = function;
  self->size = size;
  self->args = allocate_pointers(size);
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

static record_t *static_closure_record = NULL;

// - make a closure that is loaded as a program constant (from a fixup).
// - it has no captured variables, so it is permanent and not managed by gc.
closure_t *make_static_closure(function_t *function) {
  if (!static_closure_record) {
    static_closure_record = make_record();
  }

  closure_t *found = record_get(static_closure_record, function->name);
  if (found) {
    return found;
  }

  closure_t *self = new(closure_t);
  self->header.class = &closure_class;
  self->header.is_static = true;
  self->function = function;
  self->size = 0;
  record_insert_or_fail(static_closure_record, function->name, self);
  return self;
}

void closure_free(closure_t *self) {
  free(self->args);
  free(self);
}

bool is_closure(value_t value) {
  return is_object(value) &&
    to_object(value)->header.class == &closure_class;
}

closure_t *to_closure(value_t value) {
  if (!is_closure(value)) {
    who_printf("expected closure\n");
    exit(1);
  }
  return (closure_t *) to_object(value);
}

bool closure_equal(const closure_t *lhs, const closure_t *rhs) {
  if (lhs->function != rhs->function) return false;
  if (lhs->size != rhs->size) return false;
  if (lhs->args == rhs->args) return true;

  for (size_t i = 0; i < lhs->size; i++) {
    if (!equal(lhs->args[i], rhs->args[i])) return false;
  }

  return true;
}

void write_closure(buffer_t *buffer, object_circle_ctx_t *ctx, const closure_t *self) {
  write_template(buffer, "(@closure ");
  write_template(buffer, "%s", self->function->name);
  write_template(buffer, " [");
  for (size_t i = 0; i < self->size; i++) {
    if (i > 0) write_template(buffer, " ");
    write_value_in_ctx(buffer, ctx, self->args[i]);
  }
  write_template(buffer, "])");
}

void closure_for_each_child(const closure_t *closure,
                            object_visit_child_fn_t *visit, void *ctx) {
  for (size_t i = 0; i < closure->size; i++) {
    value_t value = closure->args[i];
    if (is_object(value)) visit(to_object(value), ctx);
  }
}
