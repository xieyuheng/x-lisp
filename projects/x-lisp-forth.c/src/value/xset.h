#pragma once

extern const object_class_t xset_class;

struct xset_t {
    struct object_header_t header;
    set_t *set;
};

xset_t *make_xset(void);
void xset_free(xset_t *self);

bool xset_p(value_t value);
xset_t *to_xset(value_t value);

size_t xset_size(const xset_t *self);
bool xset_empty_p(const xset_t *self);

bool xset_member_p(const xset_t *self, value_t value);
void xset_add(xset_t *self, value_t value);
bool xset_delete(xset_t *self, value_t value);
void xset_clear(xset_t *self);

xset_t *xset_copy(const xset_t *self);

bool xset_equal(const xset_t *lhs, const xset_t *rhs);
void xset_print(const xset_t *self);
// uint64_t xset_hash_code(const xset_t *self);

xset_child_iter_t *make_xset_child_iter(const xset_t *set);
void xset_child_iter_free(xset_child_iter_t *self);
object_t *xset_child_iter_next(xset_child_iter_t *iter);

xset_t *xset_union(const xset_t *lhs, const xset_t *rhs);
xset_t *xset_inter(const xset_t *lhs, const xset_t *rhs);
xset_t *xset_difference(const xset_t *lhs, const xset_t *rhs);

bool xset_subset_p(const xset_t *lhs, const xset_t *rhs);
bool xset_disjoint_p(const xset_t *lhs, const xset_t *rhs);
