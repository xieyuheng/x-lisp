#include "index.h"

static uint64_t
value_hash_fn(const void *key) {
    return value_hash_code((value_t) key);
}

static bool
value_equal_fn(const void *lhs, const void *rhs) {
    return equal_p((value_t) lhs, (value_t) rhs);
}

xset_t *
make_xset(void) {
    xset_t *self = new(xset_t);
    self->header.class = &xset_class;
    self->set = make_set();
    set_put_hash_fn(self->set, (hash_fn_t *) value_hash_fn);
    set_put_equal_fn(self->set, (equal_fn_t *) value_equal_fn);
    gc_add_object(global_gc, (object_t *) self);
    return self;
}

void
xset_free(xset_t *self) {
    set_free(self->set);
    free(self);
}

bool
xset_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &xset_class;
}

xset_t *
to_xset(value_t value) {
    assert(xset_p(value));
    return (xset_t *) to_object(value);
}

size_t
xset_size(const xset_t *self) {
    return set_size(self->set);
}

bool
xset_empty_p(const xset_t *self) {
    return set_is_empty(self->set);
}

inline bool
xset_member_p(const xset_t *self, value_t value) {
    return x_bool(set_member(self->set, (void *) value));
}

inline void
xset_add(xset_t *self, value_t value) {
    set_add(self->set, (void *) value);
}

inline bool
xset_delete(xset_t *self, value_t value) {
    return set_delete(self->set, (void *) value);
}

inline void
xset_clear(xset_t *self) {
    set_clear(self->set);
}

xset_t *
xset_copy(const xset_t *self) {
    xset_t *new_set = make_xset();
    set_iter_t iter;
    set_iter_init(&iter, self->set);
    const hash_entry_t *entry = set_iter_next_entry(&iter);
    while (entry) {
        xset_add(new_set, (value_t) entry->value);
        entry = set_iter_next_entry(&iter);
    }

    return new_set;
}

bool
xset_equal(const xset_t *lhs, const xset_t *rhs) {
    if (set_size(lhs->set) != set_size(rhs->set))
        return false;

    set_iter_t iter;
    set_iter_init(&iter, lhs->set);
    const hash_entry_t *entry = set_iter_next_entry(&iter);
    while (entry) {
        if (!xset_member_p(rhs, (value_t) entry->value))
            return false;

        entry =  set_iter_next_entry(&iter);
    }

    return true;
}

// static void
// xhash_print_entries(const xhash_t *self) {
//     hash_iter_t iter;
//     hash_iter_init(&iter, self->hash);

//     value_t key = (value_t) hash_iter_next_key(&iter);
//     while (key) {
//         value_t value = xhash_get(self, key);
//         printf(" ");
//         value_print(key);
//         printf(" ");
//         value_print(value);
//         key = (value_t) hash_iter_next_key(&iter);
//     }
// }

// void
// xhash_print(const xhash_t *self) {
//     printf("(@hash");
//     xhash_print_entries(self);
//     printf(")");
// }

// struct xhash_child_iter_t {
//     const xhash_t *hash;
//     struct hash_iter_t hash_iter;
//     const hash_entry_t *entry;
// };

// typedef struct xhash_child_iter_t xhash_child_iter_t;

// static xhash_child_iter_t *
// make_xhash_child_iter(const xhash_t *hash) {
//     xhash_child_iter_t *self = new(xhash_child_iter_t);
//     self->hash = hash;
//     hash_iter_init(&self->hash_iter, hash->hash);
//     self->entry = NULL;
//     return self;
// }

// static void
// xhash_child_iter_free(xhash_child_iter_t *self) {
//     free(self);
// }

// static object_t *
// xhash_child_iter_next(xhash_child_iter_t *iter) {
//     if (iter->entry) {
//         value_t value = (value_t) iter->entry->value;
//         iter->entry = NULL;
//         return object_p(value)
//             ? to_object(value)
//             : xhash_child_iter_next(iter);
//     }

//     iter->entry = hash_iter_next_entry(&iter->hash_iter);
//     if (iter->entry) {
//         value_t value = (value_t) iter->entry->key;
//         return object_p(value)
//             ? to_object(value)
//             : xhash_child_iter_next(iter);
//     }

//     return NULL;
// }

const object_class_t xset_class = {
    .name = "set",
    // .equal_fn = (object_equal_fn_t *) xset_equal,
    // .print_fn = (object_print_fn_t *) xset_print,
    // // .hash_code_fn = (object_hash_code_fn_t *) xset_hash_code,
    // .free_fn = (free_fn_t *) xset_free,
    // .make_child_iter_fn = (object_make_child_iter_fn_t *) make_xset_child_iter,
    // .child_iter_next_fn = (object_child_iter_next_fn_t *) xset_child_iter_next,
    // .child_iter_free_fn = (free_fn_t *) xset_child_iter_free,
};
