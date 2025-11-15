#pragma once

typedef void (print_fn_t)(const void *value, file_t *file);

struct object_spec_t {
    const char *name;
    print_fn_t *print_fn;
};

struct object_t {
    const object_spec_t *spec;
};

inline value_t
x_object(object_t *target) {
    return target;
}

inline bool
x_object_p(value_t value) {
    return value_tag(value) == X_OBJECT;
}

inline object_t *
as_object(value_t value) {
    assert(x_object_p(value));
    return value;
}
