#pragma once

typedef void (object_print_fn_t)(object_t *object);
typedef bool (object_equal_fn_t)(object_t *lhs, object_t *rhs);
typedef void (object_free_fn_t)(object_t *object);

struct object_class_t {
    const char *name;
    object_print_fn_t *print_fn;
    object_equal_fn_t *equal_fn;
    object_free_fn_t *free_fn; // null means this object is permanent
};

struct object_header_t {
    const object_class_t *class;
    bool mark;
};

struct object_t {
    struct object_header_t header;
};

value_t x_object(void *target);
bool object_p(value_t value);
object_t *to_object(value_t value);
