#include "index.h"

inline value_t
x_object(object_t *target) {
    return (value_t) ((uint64_t) target | X_OBJECT);
}

inline bool
object_p(value_t value) {
    return value_tag(value) == X_OBJECT;
}

inline object_t *
to_object(value_t value) {
    assert(object_p(value));
    return (object_t *) ((uint64_t) value & PAYLOAD_MASK);
}
