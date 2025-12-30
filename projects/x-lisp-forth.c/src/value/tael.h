#pragma once

extern const object_class_t tael_class;

struct tael_t {
    struct object_header_t header;
    array_t *elements;
    record_t *attributes;
};

tael_t *make_tael(void);
void tael_free(tael_t *self);

bool tael_p(value_t value);
tael_t *to_tael(value_t value);

value_t tael_get_element(const tael_t *self, size_t index);
void tael_put_element(tael_t *self, size_t index, value_t value);

value_t tael_pop_element(tael_t *self);
void tael_push_element(tael_t *self, value_t value);

value_t tael_shift_element(tael_t *self);
void tael_unshift_element(tael_t *self, value_t value);

value_t tael_get_attribute(const tael_t *self, const char *key);
void tael_put_attribute(tael_t *self, const char *key, value_t value);
void tael_delete_attribute(tael_t *self, const char *key);

tael_t *tael_copy(const tael_t *self);
tael_t *tael_copy_only_elements(const tael_t *self);
tael_t *tael_copy_only_attributes(const tael_t *self);

bool tael_equal(const tael_t *lhs, const tael_t *rhs);
void tael_print(const tael_t *self);
hash_code_t tael_hash_code(const tael_t *self);
ordering_t tael_compare(const tael_t *lhs, const tael_t *rhs);

tael_child_iter_t *make_tael_child_iter(const tael_t *tael);
void tael_child_iter_free(tael_child_iter_t *self);
object_t *tael_child_iter_next(tael_child_iter_t *iter);
