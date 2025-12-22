#pragma once

extern const object_class_t tael_class;

struct tael_t {
    struct object_header_t header;
    array_t *elements;
    record_t *attributes;
};

tael_t *make_tael(gc_t *gc);
void tael_free(tael_t *self);
