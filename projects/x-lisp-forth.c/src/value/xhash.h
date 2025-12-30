#pragma once

extern const object_class_t xhash_class;

struct xhash_t {
    struct object_header_t header;
    hash_t *hash;
};
