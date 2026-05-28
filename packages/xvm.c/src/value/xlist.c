#include "index.h"

const object_class_t xlist_class = {
  .name = "list",
  .equal_fn = (object_equal_fn_t *) xlist_equal,
  .format_fn = (object_format_fn_t *) xlist_format,
  .hash_code_fn = (object_hash_code_fn_t *) xlist_hash_code,
  .compare_fn = (object_compare_fn_t *) xlist_compare,
  .free_fn = (free_fn_t *) xlist_free,
  .make_child_iter_fn = (object_make_child_iter_fn_t *) make_xlist_child_iter,
  .child_iter_next_fn = (object_child_iter_next_fn_t *) xlist_child_iter_next,
  .child_iter_free_fn = (free_fn_t *) xlist_child_iter_free,
};

xlist_t *make_xlist(void) {
  xlist_t *self = new(xlist_t);
  self->header.class = &xlist_class;
  self->elements = make_array();
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

void xlist_free(xlist_t *self) {
  array_free(self->elements);
  free(self);
}

bool xlist_p(value_t value) {
  return object_p(value) &&
    to_object(value)->header.class == &xlist_class;
}

xlist_t *to_xlist(value_t value) {
  assert(xlist_p(value));
  return (xlist_t *) to_object(value);
}

inline value_t xlist_get(const xlist_t *self, size_t index) {
  return (value_t) array_get(self->elements, index);
}

inline void xlist_put(xlist_t *self, size_t index, value_t value) {
  array_put(self->elements, index, (void *) value);
}

inline value_t xlist_pop(xlist_t *self) {
  return (value_t) array_pop(self->elements);
}

inline void xlist_push(xlist_t *self, value_t value) {
  array_push(self->elements, (void *) value);
}

inline value_t xlist_pop_front(xlist_t *self) {
  return (value_t) array_pop_front(self->elements);
}

inline void xlist_push_front(xlist_t *self, value_t value) {
  array_push_front(self->elements, (void *) value);
}

xlist_t *xlist_copy(const xlist_t *self) {
  xlist_t *new_xlist = make_xlist();

  for (size_t i = 0; i < array_length(self->elements); i++) {
    array_push(new_xlist->elements, (void *) xlist_get(self, i));
  }

  return new_xlist;
}

bool xlist_equal(const xlist_t *lhs, const xlist_t *rhs) {
  if (array_length(lhs->elements) != array_length(rhs->elements))
    return false;

  for (size_t i = 0; i < array_length(lhs->elements); i++) {
    value_t left = xlist_get(lhs, i);
    value_t right = xlist_get(rhs, i);
    if (!equal_p(left, right))
      return false;
  }

  return true;
}

static void xlist_format_elements(buffer_t *buffer, object_circle_ctx_t *ctx, const xlist_t *self) {
  for (size_t i = 0; i < array_length(self->elements); i++) {
    value_format(buffer, ctx, xlist_get(self, i));
    if (i < array_length(self->elements) - 1) {
      format_template(buffer, " ");
    }
  }
}

void xlist_format(buffer_t *buffer, object_circle_ctx_t *ctx, const xlist_t *self) {
  if (array_is_empty(self->elements)) {
    format_template(buffer, "[");
    format_template(buffer, "]");
  } else {
    format_template(buffer, "[");
    xlist_format_elements(buffer, ctx, self);
    format_template(buffer, "]");
  }
}

hash_code_t xlist_hash_code(const xlist_t *self) {
  hash_code_t code = 6661; // any big prime number would do.

  for (size_t i = 0; i < array_length(self->elements); i++) {
    value_t value = xlist_get(self, i);
    code = (code << 5) - code + value_hash_code(value);
  }

  return code;
}

static ordering_t xlist_compare_elements(const xlist_t *lhs, const xlist_t *rhs) {
  size_t lhs_length = array_length(lhs->elements);
  size_t rhs_length = array_length(rhs->elements);
  size_t i = 0;
  while (true) {
    if (i == lhs_length && i == rhs_length) {
      return 0;
    }

    if (i == lhs_length) {
      return -1;
    }

    if (i == rhs_length) {
      return 1;
    }

    ordering_t ordering = value_total_compare(
      xlist_get(lhs, i),
      xlist_get(rhs, i));
    if (ordering != 0) {
      return ordering;
    }

    i++;
  }
}

ordering_t xlist_compare(const xlist_t *lhs, const xlist_t *rhs) {
  return xlist_compare_elements(lhs, rhs);
}

struct xlist_child_iter_t {
  const xlist_t *xlist;
  size_t index;
};

xlist_child_iter_t *make_xlist_child_iter(const xlist_t *xlist) {
  xlist_child_iter_t *self = new(xlist_child_iter_t);
  self->xlist = xlist;
  self->index = 0;
  return self;
}

void xlist_child_iter_free(xlist_child_iter_t *self) {
  free(self);
}

object_t *xlist_child_iter_next(xlist_child_iter_t *iter) {
  if (iter->index < array_length(iter->xlist->elements)) {
    value_t value = xlist_get(iter->xlist, iter->index++);
    return object_p(value)
      ? to_object(value)
      : xlist_child_iter_next(iter);
  }

  return NULL;
}
