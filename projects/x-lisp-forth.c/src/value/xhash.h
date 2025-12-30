#pragma once

extern const object_class_t xhash_class;

struct xhash_t {
    struct object_header_t header;
    hash_t *hash;
};

xhash_t *make_xhash(void);
void xhash_free(xhash_t *self);

bool xhash_p(value_t value);
xhash_t *to_xhash(value_t value);

size_t xhash_length(const xhash_t *self);
bool xhash_empty_p(const xhash_t *self);

value_t xhash_get(const xhash_t *self, value_t key);
void xhash_put(xhash_t *self, value_t key, value_t value);
void xhash_delete(xhash_t *self, value_t key);

xhash_t *xhash_copy(const xhash_t *self);

bool xhash_equal(const xhash_t *lhs, const xhash_t *rhs);
void xhash_print(const xhash_t *self);
uint64_t xhash_hash_code(const xhash_t *self);
ordering_t xhash_compare(const xhash_t *lhs, const xhash_t *rhs);

xhash_child_iter_t *make_xhash_child_iter(const xhash_t *hash);
void xhash_child_iter_free(xhash_child_iter_t *self);
object_t *xhash_child_iter_next(xhash_child_iter_t *iter);
