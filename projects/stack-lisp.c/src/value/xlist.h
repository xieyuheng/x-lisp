#pragma once

extern const object_class_t xlist_class;

struct xlist_t {
  struct object_header_t header;
  array_t *elements;
};

xlist_t *make_xlist(void);
void xlist_free(xlist_t *self);

bool xlist_p(value_t value);
xlist_t *to_xlist(value_t value);

value_t xlist_get(const xlist_t *self, size_t index);
void xlist_put(xlist_t *self, size_t index, value_t value);

value_t xlist_pop(xlist_t *self);
void xlist_push(xlist_t *self, value_t value);

value_t xlist_pop_front(xlist_t *self);
void xlist_push_front(xlist_t *self, value_t value);

xlist_t *xlist_copy(const xlist_t *self);

bool xlist_equal(const xlist_t *lhs, const xlist_t *rhs);
void xlist_print(object_circle_ctx_t *ctx, const xlist_t *self);
hash_code_t xlist_hash_code(const xlist_t *self);
ordering_t xlist_compare(const xlist_t *lhs, const xlist_t *rhs);

xlist_child_iter_t *make_xlist_child_iter(const xlist_t *xlist);
void xlist_child_iter_free(xlist_child_iter_t *self);
object_t *xlist_child_iter_next(xlist_child_iter_t *iter);
