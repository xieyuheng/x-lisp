#include "index.h"

const object_class_t xarray_class = {
  .name = "array",
  .equal_fn = (object_equal_fn_t *) xarray_equal,
  .write_fn = (object_write_fn_t *) write_xarray,
  .hash_code_fn = (object_hash_code_fn_t *) xarray_hash_code,
  .compare_fn = (object_compare_fn_t *) xarray_compare,
  .free_fn = (free_fn_t *) xarray_free,
  .for_each_child_fn = (object_for_each_child_fn_t *) xarray_for_each_child,
};

xarray_t *make_xarray(void) {
  xarray_t *self = new(xarray_t);
  self->header.class = &xarray_class;
  self->elements = make_array();
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

void xarray_free(xarray_t *self) {
  array_free(self->elements);
  free(self);
}

bool is_xarray(value_t value) {
  return is_object(value) &&
    to_object(value)->header.class == &xarray_class;
}

xarray_t *to_xarray(value_t value) {
  assert(is_xarray(value));
  return (xarray_t *) to_object(value);
}

inline value_t xarray_get(const xarray_t *self, size_t index) {
  return (value_t) array_get(self->elements, index);
}

inline void xarray_put(xarray_t *self, size_t index, value_t value) {
  array_put(self->elements, index, (void *) value);
  gc_write_barrier((object_t *) self, value);
}

inline value_t xarray_pop(xarray_t *self) {
  return (value_t) array_pop(self->elements);
}

inline void xarray_push(xarray_t *self, value_t value) {
  array_push(self->elements, (void *) value);
  gc_write_barrier((object_t *) self, value);
}

inline value_t xarray_pop_front(xarray_t *self) {
  return (value_t) array_pop_front(self->elements);
}

inline void xarray_push_front(xarray_t *self, value_t value) {
  array_push_front(self->elements, (void *) value);
  gc_write_barrier((object_t *) self, value);
}

xarray_t *xarray_copy(const xarray_t *self) {
  xarray_t *new_xarray = make_xarray();

  for (size_t i = 0; i < array_length(self->elements); i++) {
    xarray_push(new_xarray, xarray_get(self, i));
  }

  return new_xarray;
}

bool xarray_equal(const xarray_t *lhs, const xarray_t *rhs) {
  if (array_length(lhs->elements) != array_length(rhs->elements))
    return false;

  for (size_t i = 0; i < array_length(lhs->elements); i++) {
    value_t left = xarray_get(lhs, i);
    value_t right = xarray_get(rhs, i);
    if (!equal(left, right))
      return false;
  }

  return true;
}

static void write_xarray_elements(buffer_t *buffer, object_circle_ctx_t *ctx, const xarray_t *self) {
  for (size_t i = 0; i < array_length(self->elements); i++) {
    write_value_in_ctx(buffer, ctx, xarray_get(self, i));
    if (i < array_length(self->elements) - 1) {
      write_template(buffer, " ");
    }
  }
}

void write_xarray(buffer_t *buffer, object_circle_ctx_t *ctx, const xarray_t *self) {
  if (array_is_empty(self->elements)) {
    write_template(buffer, ctx->lang == LANG_ZH ? "(@数组)" : "(@array)");
  } else {
    write_template(buffer, ctx->lang == LANG_ZH ? "(@数组 " : "(@array ");
    write_xarray_elements(buffer, ctx, self);
    write_template(buffer, ")");
  }
}

hash_code_t xarray_hash_code(const xarray_t *self) {
  hash_code_t code = 6661; // any big prime number would do.

  for (size_t i = 0; i < array_length(self->elements); i++) {
    value_t value = xarray_get(self, i);
    code = (code << 5) - code + value_hash_code(value);
  }

  return code;
}

static ordering_t xarray_compare_elements(const xarray_t *lhs, const xarray_t *rhs) {
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
      xarray_get(lhs, i),
      xarray_get(rhs, i));
    if (ordering != 0) {
      return ordering;
    }

    i++;
  }
}

ordering_t xarray_compare(const xarray_t *lhs, const xarray_t *rhs) {
  return xarray_compare_elements(lhs, rhs);
}

void xarray_for_each_child(const xarray_t *xarray,
                           object_visit_child_fn_t *visit, void *ctx) {
  for (size_t i = 0; i < array_length(xarray->elements); i++) {
    value_t value = xarray_get(xarray, i);
    if (is_object(value)) visit(to_object(value), ctx);
  }
}
