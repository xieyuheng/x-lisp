#pragma once

extern const object_class_t xrecord_class;

struct xrecord_t {
  struct object_header_t header;
  record_t *attributes;
};

xrecord_t *make_xrecord(void);
void xrecord_free(xrecord_t *self);

bool xrecord_p(value_t value);
xrecord_t *to_xrecord(value_t value);

bool xrecord_has(const xrecord_t *self, const char *key);
value_t xrecord_get(const xrecord_t *self, const char *key);
void xrecord_put(xrecord_t *self, const char *key, value_t value);
void xrecord_delete(xrecord_t *self, const char *key);

xrecord_t *xrecord_copy(const xrecord_t *self);

bool xrecord_equal(const xrecord_t *lhs, const xrecord_t *rhs);
void xrecord_print(object_circle_ctx_t *ctx, const xrecord_t *self);
hash_code_t xrecord_hash_code(const xrecord_t *self);
ordering_t xrecord_compare(const xrecord_t *lhs, const xrecord_t *rhs);

xrecord_child_iter_t *make_xrecord_child_iter(const xrecord_t *xrecord);
void xrecord_child_iter_free(xrecord_child_iter_t *self);
object_t *xrecord_child_iter_next(xrecord_child_iter_t *iter);
