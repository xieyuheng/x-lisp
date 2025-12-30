#pragma once

typedef void (object_print_fn_t)(object_t *self);
typedef bool (object_equal_fn_t)(object_t *lhs, object_t *rhs);
typedef uint64_t (object_hash_code_fn_t)(object_t *self);

typedef void *(object_make_child_iter_fn_t)(object_t *self);
typedef object_t *(object_child_iter_next_fn_t)(void *iter);

struct object_class_t {
    const char *name;
    object_print_fn_t *print_fn;
    object_equal_fn_t *equal_fn;
    object_hash_code_fn_t *hash_code_fn;

    // - null means this object is permanent.
    free_fn_t *free_fn;

    // - `make_child_iter_fn` returns the state (`iter`) for the iterator
    //   interface functions -- `first_child_fn` and `child_iter_next_fn`,
    // - null means this object has no children.
    object_make_child_iter_fn_t *make_child_iter_fn;
    free_fn_t *child_iter_free_fn;
    object_child_iter_next_fn_t *child_iter_next_fn;
};

struct object_header_t {
    const object_class_t *class;
    bool mark;
};

struct object_t {
    struct object_header_t header;
};

void object_free(object_t *self);

void object_print(object_t *self);
