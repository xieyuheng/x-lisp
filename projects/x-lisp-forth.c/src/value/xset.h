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

xset_t *xset_copy(const xset_t *self);

// bool xset_equal(const xset_t *lhs, const xset_t *rhs);
// void xset_print(const xset_t *self);
// uint64_t xset_hash_code(const xset_t *self);
