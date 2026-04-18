#include "index.h"

// uint64_t but truncate the lower 3 bits

inline value_t
x_immediate(uint64_t target) {
    return (target << 3) | X_IMMEDIATE;
}

inline bool
immediate_p(value_t value) {
    return value_tag(value) == X_IMMEDIATE;
}

inline uint64_t
to_immediate_uint64(value_t value) {
    assert(immediate_p(value));
    return ((uint64_t) value) >> 3;
}
