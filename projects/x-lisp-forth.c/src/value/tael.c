#include "index.h"

const object_class_t tael_class = {
    .name = "tael",
    .equal_fn = (object_equal_fn_t *) tael_equal,
    .print_fn = (object_print_fn_t *) tael_print,
    .hash_code_fn = (object_hash_code_fn_t *) tael_hash_code,
    .compare_fn = (object_compare_fn_t *) tael_compare,
    .free_fn = (free_fn_t *) tael_free,
    .make_child_iter_fn = (object_make_child_iter_fn_t *) make_tael_child_iter,
    .child_iter_next_fn = (object_child_iter_next_fn_t *) tael_child_iter_next,
    .child_iter_free_fn = (free_fn_t *) tael_child_iter_free,
};

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

inline value_t
tael_get_element(const tael_t *self, size_t index) {
    return (value_t) array_get(self->elements, index);
}

inline void
tael_put_element(tael_t *self, size_t index, value_t value) {
    array_put(self->elements, index, (void *) value);
}

inline value_t
tael_pop_element(tael_t *self) {
    return (value_t) array_pop(self->elements);
}

inline void
tael_push_element(tael_t *self, value_t value) {
    array_push(self->elements, (void *) value);
}

inline value_t
tael_shift_element(tael_t *self) {
    return (value_t) array_shift(self->elements);
}

inline void
tael_unshift_element(tael_t *self, value_t value) {
    array_unshift(self->elements, (void *) value);
}

inline value_t
tael_get_attribute(const tael_t *self, const char *key) {
    hash_entry_t *entry = record_get_entry(self->attributes, key);
    if (entry) {
        return (value_t) entry->value;
    } else {
        return x_null;
    }
}

inline void
tael_put_attribute(tael_t *self, const char *key, value_t value) {
    if (null_p(value)) {
        tael_delete_attribute(self, key);
        return;
    }

    record_put(self->attributes, key, (void *) value);
}

inline void
tael_delete_attribute(tael_t *self, const char *key) {
    record_delete(self->attributes, key);
}

tael_t *
tael_copy(const tael_t *self) {
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
tael_copy_only_elements(const tael_t *self) {
    tael_t *new_tael = make_tael();

    for (size_t i = 0; i < array_length(self->elements); i++) {
        array_push(new_tael->elements, (void *) tael_get_element(self, i));
    }

    return new_tael;
}

tael_t *
tael_copy_only_attributes(const tael_t *self) {
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

bool
tael_equal(const tael_t *lhs, const tael_t *rhs) {
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

static void
tael_print_elements(const tael_t *self) {
    for (size_t i = 0; i < array_length(self->elements); i++) {
        value_print(tael_get_element(self, i));
        if (i < array_length(self->elements) - 1) {
            printf(" ");
        }
    }
}

static void
tael_print_attributes(const tael_t *self) {
    record_iter_t iter;
    record_iter_init(&iter, self->attributes);

    const char *key = record_iter_next_key(&iter);

    // no leading space for the first attribute
    if (key) {
        value_t value = tael_get_attribute(self, key);
        printf(":%s ", key);
        value_print(value);
        key = record_iter_next_key(&iter);
    }

    while (key) {
        value_t value = tael_get_attribute(self, key);
        printf(" :%s ", key);
        value_print(value);
        key = record_iter_next_key(&iter);
    }
}

void
tael_print(const tael_t *self) {
    if (array_is_empty(self->elements)) {
        printf("[");
        tael_print_attributes(self);
        printf("]");
    } else if (record_is_empty(self->attributes)) {
        printf("[");
        tael_print_elements(self);
        printf("]");
    } else {
        printf("[");
        tael_print_elements(self);
        printf(" ");
        tael_print_attributes(self);
        printf("]");
    }
}

static ordering_t
compare_hash_entry(const hash_entry_t *lhs, const hash_entry_t *rhs) {
    return string_compare_lexical(lhs->key, rhs->key);
}

hash_code_t
tael_hash_code(const tael_t *self) {
    hash_code_t code = 6661; // any big prime number would do.

    for (size_t i = 0; i < array_length(self->elements); i++) {
        value_t value = tael_get_element(self, i);
        code = (code << 5) - code + value_hash_code(value);
    }

    array_t *entries = record_entries(self->attributes);
    array_sort(entries, (compare_fn_t *) compare_hash_entry);
    for (size_t i = 0; i < array_length(entries); i++) {
        const hash_entry_t *entry = array_get(entries, i);
        const char *key = entry->key;
        value_t value = (value_t) entry->value;
        if (!null_p(value)) {
            code = (code << 5) + code + string_hash_code(key);
            code = (code << 5) - code + value_hash_code(value);
        }
    }

    array_free(entries);
    return code;
}

static ordering_t
tael_compare_elements(const tael_t *lhs, const tael_t *rhs) {
    size_t lhs_length = array_length(lhs->elements);
    size_t rhs_length = array_length(rhs->elements);
    size_t i = 0;
    while (true) {
        if (i == lhs_length && i == rhs_length) {
            return 0;
        }

        if (i == lhs_length) {
            return -1;
        }

        if (i == rhs_length) {
            return 1;
        }

        ordering_t ordering = value_total_compare(
            tael_get_element(lhs, i),
            tael_get_element(rhs, i));
        if (ordering != 0) {
            return ordering;
        }

        i++;
    }
}

static ordering_t
compare_attribute_entry(const hash_entry_t *lhs, const hash_entry_t *rhs) {
    ordering_t ordering = string_compare_lexical(lhs->key, rhs->key);
    if (ordering != 0) {
        return ordering;
    }

    return value_total_compare((value_t) lhs->value, (value_t) rhs->value);
}

static ordering_t
tael_compare_attributes(const tael_t *lhs, const tael_t *rhs) {
    array_t *lhs_entries = record_entries(lhs->attributes);
    array_t *rhs_entries = record_entries(rhs->attributes);
    array_sort(lhs_entries, (compare_fn_t *) compare_attribute_entry);
    array_sort(rhs_entries, (compare_fn_t *) compare_attribute_entry);
    size_t lhs_length = array_length(lhs_entries);
    size_t rhs_length = array_length(rhs_entries);

    size_t i = 0;
    ordering_t ordering;
    while (true) {
        if (i == lhs_length && i == rhs_length) {
            ordering = 0;
            break;
        }

        if (i == lhs_length) {
            ordering = -1;
            break;
        }

        if (i == rhs_length) {
            ordering = 1;
            break;
        }

        ordering = compare_attribute_entry(
            array_get(lhs_entries, i),
            array_get(rhs_entries, i));
        if (ordering != 0) {
            break;
        }

        i++;
    }

    array_free(lhs_entries);
    array_free(rhs_entries);
    return ordering;
}

ordering_t
tael_compare(const tael_t *lhs, const tael_t *rhs) {
    ordering_t ordering = tael_compare_elements(lhs, rhs);
    if (ordering != 0) {
        return ordering;
    }

    return tael_compare_attributes(lhs, rhs);
}

struct tael_child_iter_t {
    const tael_t *tael;
    size_t index;
    struct record_iter_t record_iter;
};

tael_child_iter_t *
make_tael_child_iter(const tael_t *tael) {
    tael_child_iter_t *self = new(tael_child_iter_t);
    self->tael = tael;
    self->index = 0;
    record_iter_init(&self->record_iter, tael->attributes);
    return self;
}

void
tael_child_iter_free(tael_child_iter_t *self) {
    free(self);
}

object_t *
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
