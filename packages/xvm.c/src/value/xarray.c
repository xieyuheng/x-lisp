#include "index.h"

static void xarray_gc_copy(object_t *dest, const object_t *src,
                           object_forward_value_fn_t *forward);
static void xarray_forward(object_t *self, object_forward_value_fn_t *forward);
static void xarray_destroy(object_t *self);
static size_t xarray_inner_bytes(object_t *self_);

const object_class_t xarray_class = {
  .name = "array",
  .equal_fn = (object_equal_fn_t *) xarray_equal,
  .write_fn = (object_write_fn_t *) write_xarray,
  .hash_code_fn = (object_hash_code_fn_t *) xarray_hash_code,
  .compare_fn = (object_compare_fn_t *) xarray_compare,
  .free_fn = (free_fn_t *) xarray_free,
  .for_each_child_fn = (object_for_each_child_fn_t *) xarray_for_each_child,
  .copy_fn = (object_copy_fn_t *) xarray_gc_copy,
  .forward_fn = (object_forward_fn_t *) xarray_forward,
  .destroy_fn = (object_destroy_fn_t *) xarray_destroy,
  .inner_bytes_fn = (object_inner_bytes_fn_t *) xarray_inner_bytes,
};

static inline value_t *xarray_slot(const xarray_t *self, size_t index) {
  return &self->elements[(self->front + index) % self->capacity];
}

xarray_t *make_xarray(void) {
  xarray_t *self = gc_new(sizeof(xarray_t));
  self->header.class = &xarray_class;
  self->front = 0;
  self->length = 0;
  self->capacity = XARRAY_INLINE_CAPACITY;
  self->elements = self->inline_elements;
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

static void xarray_grow(xarray_t *self) {
  size_t capacity = self->capacity * 2;
  value_t *elements = allocate(capacity * sizeof(value_t));
  for (size_t i = 0; i < self->length; i++) {
    elements[i] = *xarray_slot(self, i);
  }
  if (self->elements != self->inline_elements) {
    free(self->elements);
  }
  self->elements = elements;
  self->front = 0;
  self->capacity = capacity;
}

size_t xarray_length(const xarray_t *self) {
  return self->length;
}

bool xarray_is_empty(const xarray_t *self) {
  return self->length == 0;
}

value_t xarray_get(const xarray_t *self, size_t index) {
  return *xarray_slot(self, index);
}

void xarray_put(xarray_t *self, size_t index, value_t value) {
  *xarray_slot(self, index) = value;
  gc_write_barrier((object_t *) self, value);
}

value_t xarray_pop(xarray_t *self) {
  assert(self->length > 0);
  self->length -= 1;
  return *xarray_slot(self, self->length);
}

void xarray_push(xarray_t *self, value_t value) {
  if (self->length == self->capacity) xarray_grow(self);
  *xarray_slot(self, self->length) = value;
  self->length += 1;
  gc_write_barrier((object_t *) self, value);
}

value_t xarray_pop_front(xarray_t *self) {
  assert(self->length > 0);
  value_t value = *xarray_slot(self, 0);
  self->front = (self->front + 1) % self->capacity;
  self->length -= 1;
  return value;
}

void xarray_push_front(xarray_t *self, value_t value) {
  if (self->length == self->capacity) xarray_grow(self);
  self->front = (self->front + self->capacity - 1) % self->capacity;
  *xarray_slot(self, 0) = value;
  self->length += 1;
  gc_write_barrier((object_t *) self, value);
}

void xarray_reverse(xarray_t *self) {
  size_t i = 0;
  size_t j = self->length;
  while (i + 1 < j) {
    j -= 1;
    value_t value = *xarray_slot(self, i);
    *xarray_slot(self, i) = *xarray_slot(self, j);
    *xarray_slot(self, j) = value;
    i += 1;
  }
}

static size_t xarray_inner_bytes(object_t *self_) {
  xarray_t *self = (xarray_t *) self_;
  return self->length * sizeof(value_t);
}

static void xarray_destroy(object_t *self_) {
  xarray_t *self = (xarray_t *) self_;
  if (self->elements != self->inline_elements) {
    free(self->elements);
  }
}

static void xarray_gc_copy(object_t *dest_, const object_t *src_,
                           object_forward_value_fn_t *forward) {
  xarray_t *dest = (xarray_t *) dest_;
  const xarray_t *src = (const xarray_t *) src_;
  dest->front = 0;
  dest->length = src->length;
  if (src->elements == src->inline_elements) {
    dest->capacity = XARRAY_INLINE_CAPACITY;
    dest->elements = dest->inline_elements;
  } else {
    dest->capacity = src->capacity;
    dest->elements = allocate(src->capacity * sizeof(value_t));
  }
  for (size_t i = 0; i < src->length; i++) {
    dest->elements[i] = forward(*xarray_slot(src, i));
  }
  if (src->elements != src->inline_elements) {
    free(src->elements);
  }
}

static void xarray_forward(object_t *self_,
                           object_forward_value_fn_t *forward) {
  xarray_t *self = (xarray_t *) self_;
  for (size_t i = 0; i < self->length; i++) {
    value_t *slot = xarray_slot(self, i);
    *slot = forward(*slot);
  }
}

void xarray_free(xarray_t *self) {
  xarray_destroy((object_t *) self);
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

xarray_t *xarray_copy(const xarray_t *self) {
  xarray_t *new_xarray = make_xarray();
  for (size_t i = 0; i < self->length; i++) {
    xarray_push(new_xarray, xarray_get(self, i));
  }
  return new_xarray;
}

bool xarray_equal(const xarray_t *lhs, const xarray_t *rhs) {
  if (lhs->length != rhs->length) return false;

  for (size_t i = 0; i < lhs->length; i++) {
    if (!equal(xarray_get(lhs, i), xarray_get(rhs, i))) return false;
  }

  return true;
}

static void write_xarray_elements(buffer_t *buffer, object_circle_ctx_t *ctx,
                                  const xarray_t *self) {
  for (size_t i = 0; i < self->length; i++) {
    write_value_in_ctx(buffer, ctx, xarray_get(self, i));
    if (i < self->length - 1) {
      write_template(buffer, " ");
    }
  }
}

void write_xarray(buffer_t *buffer, object_circle_ctx_t *ctx,
                  const xarray_t *self) {
  if (self->length == 0) {
    write_template(buffer, ctx->lang == LANG_ZH ? "(@数组)" : "(@array)");
  } else {
    write_template(buffer, ctx->lang == LANG_ZH ? "(@数组 " : "(@array ");
    write_xarray_elements(buffer, ctx, self);
    write_template(buffer, ")");
  }
}

hash_code_t xarray_hash_code(const xarray_t *self) {
  hash_code_t code = 6661; // any big prime number would do.
  for (size_t i = 0; i < self->length; i++) {
    code = (code << 5) - code + value_hash_code(xarray_get(self, i));
  }
  return code;
}

ordering_t xarray_compare(const xarray_t *lhs, const xarray_t *rhs) {
  size_t i = 0;
  while (true) {
    if (i == lhs->length && i == rhs->length) return 0;
    if (i == lhs->length) return -1;
    if (i == rhs->length) return 1;
    ordering_t ordering = value_total_compare(
      xarray_get(lhs, i), xarray_get(rhs, i));
    if (ordering != 0) return ordering;
    i++;
  }
}

void xarray_for_each_child(const xarray_t *xarray,
                           object_visit_child_fn_t *visit, void *ctx) {
  for (size_t i = 0; i < xarray->length; i++) {
    value_t value = xarray_get(xarray, i);
    if (is_object(value)) visit(to_object(value), ctx);
  }
}
