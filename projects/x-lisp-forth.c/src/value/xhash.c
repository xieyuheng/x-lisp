#include "index.h"

static uint64_t
value_hash_fn(const void *key) {
    return value_hash_code((value_t) key);
}

xhash_t *
make_xhash(void) {
    xhash_t *self = new(xhash_t);
    self->header.class = &xhash_class;
    self->hash = make_hash();
    hash_put_hash_fn(self->hash, (hash_fn_t *) value_hash_fn);
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

struct xhash_child_iter_t {
    const xhash_t *hash;
    struct hash_iter_t hash_iter;
    const hash_entry_t *entry;
};

typedef struct xhash_child_iter_t xhash_child_iter_t;

static xhash_child_iter_t *
make_xhash_child_iter(const xhash_t *hash) {
    xhash_child_iter_t *self = new(xhash_child_iter_t);
    self->hash = hash;
    hash_iter_init(&self->hash_iter, hash->hash);
    self->entry = NULL;
    return self;
}

static void
xhash_child_iter_free(xhash_child_iter_t *self) {
    free(self);
}

static object_t *
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

const object_class_t xhash_class = {
    .name = "hash",
    .equal_fn = (object_equal_fn_t *) xhash_equal,
    .print_fn = (object_print_fn_t *) xhash_print,
    // .hash_code_fn = (object_hash_code_fn_t *) xhash_hash_code,
    .free_fn = (free_fn_t *) xhash_free,
    .make_child_iter_fn = (object_make_child_iter_fn_t *) make_xhash_child_iter,
    .child_iter_next_fn = (object_child_iter_next_fn_t *) xhash_child_iter_next,
    .child_iter_free_fn = (free_fn_t *) xhash_child_iter_free,
};
