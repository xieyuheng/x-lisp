#include "index.h"

tael_t *
make_tael(void) {
    tael_t *self = new(tael_t);
    self->header.class = &tael_class;
    self->elements = make_array();
    self->attributes = make_record();
    gc_add_object(global_gc, (object_t *) self);
    return self;
}

void
tael_free(tael_t *self) {
    array_free(self->elements);
    record_free(self->attributes);
    free(self);
}

bool
tael_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &tael_class;
}

tael_t *
to_tael(value_t value) {
    assert(tael_p(value));
    return (tael_t *) to_object(value);
}

bool
tael_equal(tael_t *lhs, tael_t *rhs) {
    if (array_length(lhs->elements) != array_length(rhs->elements))
        return false;

    for (size_t i = 0; i < array_length(lhs->elements); i++) {
        value_t left = tael_get_element(lhs, i);
        value_t right = tael_get_element(rhs, i);
        if (!equal_p(left, right))
            return false;
    }

    if (record_length(lhs->attributes) != record_length(rhs->attributes))
        return false;

    record_iter_t iter;
    record_iter_init(&iter, lhs->attributes);
    const char *key = record_iter_next_key(&iter);
    while (key) {
        value_t left = tael_get_attribute(lhs, key);
        value_t right = tael_get_attribute(rhs, key);
        if (!equal_p(left, right))
            return false;

        key = record_iter_next_key(&iter);
    }

    return true;
}

void
tael_print(tael_t *self) {
    printf("[");

    for (size_t i = 0; i < array_length(self->elements); i++) {
        value_print(tael_get_element(self, i));
        if (i < array_length(self->elements) - 1) {
            printf(" ");
        }
    }

    record_iter_t iter;
    record_iter_init(&iter, self->attributes);
    const char *key = record_iter_next_key(&iter);
    while (key) {
        value_t value = tael_get_attribute(self, key);
        printf(" :%s ", key);
        value_print(value);
        key = record_iter_next_key(&iter);
    }

    printf("]");
}

struct tael_child_iter_t {
    const tael_t *tael;
    size_t index;
    struct record_iter_t record_iter;
};

typedef struct tael_child_iter_t tael_child_iter_t;

static tael_child_iter_t *
make_tael_child_iter(const tael_t *tael) {
    tael_child_iter_t *self = new(tael_child_iter_t);
    self->tael = tael;
    self->index = 0;
    record_iter_init(&self->record_iter, tael->attributes);
    return self;
}

static void
tael_child_iter_free(tael_child_iter_t *self) {
    free(self);
}

static object_t *
tael_child_iter_next(tael_child_iter_t *iter) {
    if (iter->index < array_length(iter->tael->elements)) {
        value_t value = tael_get_element(iter->tael, iter->index++);
        return object_p(value)
            ? to_object(value)
            : tael_child_iter_next(iter);
    }

    const hash_entry_t *entry = record_iter_next_entry(&iter->record_iter);
    if (entry) {
        value_t value = (value_t) entry->value;
        return object_p(value)
            ? to_object(value)
            : tael_child_iter_next(iter);
    }

    return NULL;
}

const object_class_t tael_class = {
    .name = "tael",
    .print_fn = (object_print_fn_t *) tael_print,
    .equal_fn = (object_equal_fn_t *) tael_equal,
    .free_fn = (free_fn_t *) tael_free,
    .make_child_iter_fn = (object_make_child_iter_fn_t *) make_tael_child_iter,
    .child_iter_free_fn = (free_fn_t *) tael_child_iter_free,
    .child_iter_next_fn = (object_child_iter_next_fn_t *) tael_child_iter_next,
};

inline value_t
tael_get_element(const tael_t *self, size_t index) {
    return (value_t) array_get(self->elements, index);
}

inline void
tael_put_element(tael_t *self, size_t index, value_t value) {
    array_put(self->elements, index, (void *) value);
}

inline void
tael_push_element(tael_t *self, value_t value) {
    array_push(self->elements, (void *) value);
}

inline value_t
tael_pop_element(tael_t *self) {
    return (value_t) array_pop(self->elements);
}

inline value_t
tael_get_attribute(const tael_t *self, const char *key) {
    return (value_t) record_get(self->attributes, key);
}

inline void
tael_put_attribute(tael_t *self, const char *key, value_t value) {
    record_put(self->attributes, key, (void *) value);
}

tael_t *
tael_copy(tael_t *self) {
    tael_t *new_tael = make_tael();

    for (size_t i = 0; i < array_length(self->elements); i++) {
        array_push(new_tael->elements, (void *) tael_get_element(self, i));
    }

    record_iter_t iter;
    record_iter_init(&iter, self->attributes);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        tael_put_attribute(new_tael, entry->key, (value_t) entry->value);
        entry = record_iter_next_entry(&iter);
    }

    return new_tael;
}

tael_t *
tael_copy_only_elements(tael_t *self) {
    tael_t *new_tael = make_tael();

    for (size_t i = 0; i < array_length(self->elements); i++) {
        array_push(new_tael->elements, (void *) tael_get_element(self, i));
    }

    return new_tael;
}

tael_t *
tael_copy_only_attributes(tael_t *self) {
    tael_t *new_tael = make_tael();

    record_iter_t iter;
    record_iter_init(&iter, self->attributes);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        tael_put_attribute(new_tael, entry->key, (value_t) entry->value);
        entry = record_iter_next_entry(&iter);
    }

    return new_tael;
}
