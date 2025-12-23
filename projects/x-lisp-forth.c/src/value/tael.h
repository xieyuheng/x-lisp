#pragma once

extern const object_class_t tael_class;

struct tael_t {
    struct object_header_t header;
    array_t *elements;
    record_t *attributes;
};

tael_t *make_tael(gc_t *gc);
void tael_free(tael_t *self);

bool tael_p(value_t value);
tael_t *to_tael(value_t value);

bool tael_equal(tael_t *lhs, tael_t *rhs);
void tael_print(tael_t *self);

value_t tael_get_element(tael_t *self, size_t index);
void tael_put_element(tael_t *self, size_t index, value_t value);

value_t tael_get_attribute(tael_t *self, const char *key);
void tael_put_attribute(tael_t *self, const char *key, value_t value);
