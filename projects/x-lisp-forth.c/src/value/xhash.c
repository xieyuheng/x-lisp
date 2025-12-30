#include "index.h"

const object_class_t xhash_class = {
    .name = "hash",
    .equal_fn = (object_equal_fn_t *) xhash_equal,
    .print_fn = (object_print_fn_t *) xhash_print,
    .hash_code_fn = (object_hash_code_fn_t *) xhash_hash_code,
    .compare_fn = (object_compare_fn_t *) xhash_compare,
    .free_fn = (free_fn_t *) xhash_free,
    .make_child_iter_fn = (object_make_child_iter_fn_t *) make_xhash_child_iter,
    .child_iter_next_fn = (object_child_iter_next_fn_t *) xhash_child_iter_next,
    .child_iter_free_fn = (free_fn_t *) xhash_child_iter_free,
};

static uint64_t
value_hash_fn(const void *key) {
    return value_hash_code((value_t) key);
}

static bool
value_equal_fn(const void *lhs, const void *rhs) {
    return equal_p((value_t) lhs, (value_t) rhs);
}

xhash_t *
make_xhash(void) {
    xhash_t *self = new(xhash_t);
    self->header.class = &xhash_class;
    self->hash = make_hash();
    hash_put_hash_fn(self->hash, (hash_fn_t *) value_hash_fn);
    hash_put_key_equal_fn(self->hash, (equal_fn_t *) value_equal_fn);
    gc_add_object(global_gc, (object_t *) self);
    return self;
}

void
xhash_free(xhash_t *self) {
    hash_free(self->hash);
    free(self);
}

bool
xhash_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &xhash_class;
}

xhash_t *
to_xhash(value_t value) {
    assert(xhash_p(value));
    return (xhash_t *) to_object(value);
}

size_t
xhash_length(const xhash_t *self) {
    return hash_length(self->hash);
}

bool
xhash_empty_p(const xhash_t *self) {
    return hash_is_empty(self->hash);
}

inline value_t
xhash_get(const xhash_t *self, value_t key) {
    hash_entry_t *entry = hash_get_entry(self->hash, (void *) key);
    if (entry) {
        return (value_t) entry->value;
    } else {
        return x_null;
    }
}

inline void
xhash_put(xhash_t *self, value_t key, value_t value) {
    if (null_p(value)) {
        xhash_delete(self, key);
        return;
    }

    hash_put(self->hash, (void *) key, (void *) value);
}

inline void
xhash_delete(xhash_t *self, value_t key) {
    hash_delete(self->hash, (void *) key);
}

xhash_t *
xhash_copy(const xhash_t *self) {
    xhash_t *new_hash = make_xhash();
    hash_iter_t iter;
    hash_iter_init(&iter, self->hash);
    const hash_entry_t *entry = hash_iter_next_entry(&iter);
    while (entry) {
        xhash_put(new_hash, (value_t) entry->key, (value_t) entry->value);
        entry = hash_iter_next_entry(&iter);
    }

    return new_hash;
}

bool
xhash_equal(const xhash_t *lhs, const xhash_t *rhs) {
    if (hash_length(lhs->hash) != hash_length(rhs->hash))
        return false;

    hash_iter_t iter;
    hash_iter_init(&iter, lhs->hash);
    value_t key = (value_t) hash_iter_next_key(&iter);
    while (key) {
        value_t left = xhash_get(lhs, key);
        value_t right = xhash_get(rhs, key);
        if (!equal_p(left, right))
            return false;

        key = (value_t) hash_iter_next_key(&iter);
    }

    return true;
}

static void
xhash_print_entries(const xhash_t *self) {
    hash_iter_t iter;
    hash_iter_init(&iter, self->hash);

    value_t key = (value_t) hash_iter_next_key(&iter);
    while (key) {
        value_t value = xhash_get(self, key);
        printf(" ");
        value_print(key);
        printf(" ");
        value_print(value);
        key = (value_t) hash_iter_next_key(&iter);
    }
}

void
xhash_print(const xhash_t *self) {
    printf("(@hash");
    xhash_print_entries(self);
    printf(")");
}

static ordering_t
compare_hash_entry(const hash_entry_t *lhs, const hash_entry_t *rhs) {
    ordering_t ordering =
        value_total_compare((value_t) lhs->key, (value_t) rhs->key);
    if (ordering != 0) {
        return ordering;
    }

    return value_total_compare((value_t) lhs->value, (value_t) rhs->value);
}

uint64_t
xhash_hash_code(const xhash_t *self) {
    uint64_t code = 7001; // any big prime number would do.

    array_t *entries = hash_entries(self->hash);
    array_sort(entries, (compare_fn_t *) compare_hash_entry);
    for (size_t i = 0; i < array_length(entries); i++) {
        const hash_entry_t *entry = array_get(entries, i);
        value_t key = (value_t) entry->value;
        value_t value = (value_t) entry->value;
        if (!null_p(value)) {
            code = (code << 5) + code + value_hash_code(key);
            code = (code << 5) + code + value_hash_code(value);
        }
    }

    array_free(entries);
    return code;
}

ordering_t
xhash_compare(const xhash_t *lhs, const xhash_t *rhs) {
    array_t *lhs_entries = hash_entries(lhs->hash);
    array_t *rhs_entries = hash_entries(rhs->hash);
    array_sort(lhs_entries, (compare_fn_t *) compare_hash_entry);
    array_sort(rhs_entries, (compare_fn_t *) compare_hash_entry);
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

        ordering = compare_hash_entry(
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

struct xhash_child_iter_t {
    const xhash_t *hash;
    struct hash_iter_t hash_iter;
    const hash_entry_t *entry;
};

xhash_child_iter_t *
make_xhash_child_iter(const xhash_t *hash) {
    xhash_child_iter_t *self = new(xhash_child_iter_t);
    self->hash = hash;
    hash_iter_init(&self->hash_iter, hash->hash);
    self->entry = NULL;
    return self;
}

void
xhash_child_iter_free(xhash_child_iter_t *self) {
    free(self);
}

object_t *
xhash_child_iter_next(xhash_child_iter_t *iter) {
    if (iter->entry) {
        value_t value = (value_t) iter->entry->value;
        iter->entry = NULL;
        return object_p(value)
            ? to_object(value)
            : xhash_child_iter_next(iter);
    }

    iter->entry = hash_iter_next_entry(&iter->hash_iter);
    if (iter->entry) {
        value_t value = (value_t) iter->entry->key;
        return object_p(value)
            ? to_object(value)
            : xhash_child_iter_next(iter);
    }

    return NULL;
}
