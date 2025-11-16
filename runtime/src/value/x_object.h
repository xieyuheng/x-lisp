#pragma once

typedef void (object_print_fn_t)(const void *value, file_t *file);

struct object_spec_t {
    const char *name;
    object_print_fn_t *print_fn;
};

struct object_t {
    const object_spec_t *spec;
};

inline value_t
x_object(object_t *target) {
    return (value_t) ((uint64_t) target | X_OBJECT);
}

inline bool
x_object_p(value_t value) {
    return value_tag(value) == X_OBJECT;
}

inline object_t *
to_object(value_t value) {
    assert(x_object_p(value));
    return (object_t *) ((uint64_t) value & PAYLOAD_MASK);
}
