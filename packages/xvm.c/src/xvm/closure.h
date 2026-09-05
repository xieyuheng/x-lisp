#pragma once

extern const object_class_t closure_class;

typedef struct closure_child_iter_t closure_child_iter_t;

struct closure_t {
  struct object_header_t header;
  function_t *function;
  size_t size;
  value_t *args;
};

closure_t *make_closure(function_t *function, size_t size);
void closure_free(closure_t *self);

bool is_closure(value_t value);
closure_t *to_closure(value_t value);

bool closure_equal(const closure_t *lhs, const closure_t *rhs);
void write_closure(buffer_t *buffer, object_circle_ctx_t *ctx, const closure_t *self);

closure_child_iter_t *make_closure_child_iter(const closure_t *closure);
void closure_child_iter_free(closure_child_iter_t *self);
object_t *closure_child_iter_next(closure_child_iter_t *iter);
