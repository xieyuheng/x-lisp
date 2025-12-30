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

// value_t xset_get(const xset_t *self, value_t key);
// void xset_put(xset_t *self, value_t key, value_t value);
// void xset_delete(xset_t *self, value_t key);

// xset_t *xset_copy(const xset_t *self);

// bool xset_equal(const xset_t *lhs, const xset_t *rhs);
// void xset_print(const xset_t *self);
// uint64_t xset_hash_code(const xset_t *self);
