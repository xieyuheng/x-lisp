#pragma once

extern const object_class_t xarray_class;

struct xarray_t {
  struct object_header_t header;
  array_t *elements;
};

xarray_t *make_xarray(void);
void xarray_free(xarray_t *self);

bool is_xarray(value_t value);
xarray_t *to_xarray(value_t value);

value_t xarray_get(const xarray_t *self, size_t index);
void xarray_put(xarray_t *self, size_t index, value_t value);

value_t xarray_pop(xarray_t *self);
void xarray_push(xarray_t *self, value_t value);

value_t xarray_pop_front(xarray_t *self);
void xarray_push_front(xarray_t *self, value_t value);

xarray_t *xarray_copy(const xarray_t *self);

bool xarray_equal(const xarray_t *lhs, const xarray_t *rhs);
void write_xarray(buffer_t *buffer, object_circle_ctx_t *ctx, const xarray_t *self);
hash_code_t xarray_hash_code(const xarray_t *self);
ordering_t xarray_compare(const xarray_t *lhs, const xarray_t *rhs);

void xarray_for_each_child(const xarray_t *xarray,
                           object_visit_child_fn_t *visit, void *ctx);