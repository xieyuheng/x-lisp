#include "index.h"

const object_class_t xset_class = {
    .name = "set",
    .equal_fn = (object_equal_fn_t *) xset_equal,
    .print_fn = (object_print_fn_t *) xset_print,
    // .hash_code_fn = (object_hash_code_fn_t *) xset_hash_code,
    .free_fn = (free_fn_t *) xset_free,
    .make_child_iter_fn = (object_make_child_iter_fn_t *) make_xset_child_iter,
    .child_iter_next_fn = (object_child_iter_next_fn_t *) xset_child_iter_next,
    .child_iter_free_fn = (free_fn_t *) xset_child_iter_free,
};

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
    return set_member(self->set, (void *) value);
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

static void
xset_print_entries(const xset_t *self) {
    set_iter_t iter;
    set_iter_init(&iter, self->set);

    const hash_entry_t *entry = set_iter_next_entry(&iter);
    while (entry) {
        printf(" ");
        value_print((value_t) entry->value);
        entry = set_iter_next_entry(&iter);
    }
}

void
xset_print(const xset_t *self) {
    printf("(@set");
    xset_print_entries(self);
    printf(")");
}

struct xset_child_iter_t {
    const xset_t *set;
    struct set_iter_t set_iter;
};

xset_child_iter_t *
make_xset_child_iter(const xset_t *set) {
    xset_child_iter_t *self = new(xset_child_iter_t);
    self->set = set;
    set_iter_init(&self->set_iter, set->set);
    return self;
}

void
xset_child_iter_free(xset_child_iter_t *self) {
    free(self);
}

object_t *
xset_child_iter_next(xset_child_iter_t *iter) {
    const hash_entry_t *entry = set_iter_next_entry(&iter->set_iter);
    if (entry) {
        value_t value = (value_t) entry->value;
        return object_p(value)
            ? to_object(value)
            : xset_child_iter_next(iter);
    }

    return NULL;
}

xset_t *
xset_union(const xset_t *lhs, const xset_t *rhs) {
    xset_t *new_set = xset_copy(lhs);
    set_iter_t iter;
    set_iter_init(&iter, rhs->set);
    const hash_entry_t *entry = set_iter_next_entry(&iter);
    while (entry) {
        xset_add(new_set, (value_t) entry->value);
        entry = set_iter_next_entry(&iter);
    }

    return new_set;
}

xset_t *
xset_inter(const xset_t *lhs, const xset_t *rhs) {
    xset_t *new_set = make_xset();
    set_iter_t iter;
    set_iter_init(&iter, lhs->set);
    const hash_entry_t *entry = set_iter_next_entry(&iter);
    while (entry) {
        if (xset_member_p(rhs, (value_t) entry->value)) {
            xset_add(new_set, (value_t) entry->value);
        }

        entry = set_iter_next_entry(&iter);
    }

    return new_set;
}

xset_t *
xset_difference(const xset_t *lhs, const xset_t *rhs) {
    xset_t *new_set = xset_copy(lhs);
    set_iter_t iter;
    set_iter_init(&iter, rhs->set);
    const hash_entry_t *entry = set_iter_next_entry(&iter);
    while (entry) {
        xset_delete(new_set, (value_t) entry->value);
        entry = set_iter_next_entry(&iter);
    }

    return new_set;
}

bool
xset_subset_p(const xset_t *lhs, const xset_t *rhs) {
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

bool
xset_disjoint_p(const xset_t *lhs, const xset_t *rhs) {
    set_iter_t iter;
    set_iter_init(&iter, lhs->set);
    const hash_entry_t *entry = set_iter_next_entry(&iter);
    while (entry) {
        if (xset_member_p(rhs, (value_t) entry->value))
            return false;

        entry =  set_iter_next_entry(&iter);
    }

    return true;
}
