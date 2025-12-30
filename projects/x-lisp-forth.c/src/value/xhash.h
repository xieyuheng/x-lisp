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
